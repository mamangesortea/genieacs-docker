# ISP Billing Service Structure

The billing service should be developed and deployed independently from
`genieacs-docker`. This repository currently contains no deployment
configuration or application code, so the structure below is a blueprint,
not an implemented service or a claim of GenieACS integration. A separate
static UI prototype is available under `billing-ui/`; it is for UX review only,
uses in-memory sample data, and is not part of a production service. Its
GenieACS screen includes example NBI metadata and operator-managed device-to-
customer links; synchronization remains simulated.

## Project layout

```text
isp-billing/
├── README.md
├── docs/
│   ├── architecture.md
│   └── api.md
├── migrations/
├── src/
│   ├── domain/
│   │   ├── customers/
│   │   ├── plans/
│   │   └── invoices/
│   ├── application/
│   │   ├── customers/
│   │   ├── plans/
│   │   └── invoicing/
│   ├── ports/
│   │   ├── repositories/
│   │   └── clock/
│   ├── adapters/
│   │   ├── http/
│   │   └── persistence/
│   ├── jobs/
│   │   └── generate-recurring-invoices
│   └── config/
├── tests/
│   ├── unit/
│   └── integration/
└── deploy/
    ├── Dockerfile
    └── examples/
```

The language, web framework, database engine, and deployment platform are
intentionally undecided. Choose them when the billing service is created in its
own project.

## Initial responsibilities

- **Customers:** maintain billing accounts and an optional stable external
  customer reference. Do not depend on undocumented GenieACS internals.
- **Plans:** maintain plan name, price, billing interval, currency, and active
  status. Changes to a plan should not silently rewrite invoices already
  issued.
- **Invoices:** record the customer, plan snapshot, billing-period start and
  end, issue date, due date, amount, currency, and lifecycle status.
- **Recurring invoicing job:** find eligible accounts and plans for each
  billing period, create invoices transactionally, and safely retry after
  failure.
- **Persistence:** use a relational database owned by the service, with schema
  migrations and repository interfaces.
- **HTTP adapter:** expose a versioned API for managing customers, plans, and
  invoices. Authentication and authorization must be defined before exposing
  it outside a trusted network.

## MikroTik integration

The MikroTik page in `billing-ui/` is a static UX prototype: its router
addresses, secret references, and profile mappings are examples only. The
browser neither tests connections nor applies subscriber configuration.

Implement any production RouterOS API adapter in the separate billing backend,
not in browser JavaScript. Prefer API-SSL with certificate verification,
restrict management access to the billing backend network, use a
least-privilege router account, and retrieve its credentials from a secret
manager. The UI should only refer to a backend-managed secret identifier.

Before implementing live provisioning, confirm supported RouterOS versions,
network reachability, whether plans map to PPP profiles or Simple Queues, and
the operator-approved policy for overdue invoices, grace periods, suspension,
and service restoration. An overdue invoice must not automatically disconnect
service until those rules have been decided and explicitly implemented.

## Invoice generation and lifecycle

Use a unique invoice key for the billing account and period (for example, a
unique constraint over account ID, plan assignment ID, and period start). The
generation job must rely on that constraint or an equivalent transactional
mechanism, so a retry cannot create a second invoice for the same period.

Keep the initial lifecycle small: `draft` → `issued` → `paid` or `void`.
Invoice creation should snapshot the plan name, price, and currency used for
that period. Payment collection, taxes, usage rating, and dunning are outside
the initial scope.

## Integration boundary

The billing service owns billing records and refers to GenieACS customers only
through a stable external identifier when one is available. Do not write to
GenieACS internals or assume an undocumented customer API.

### MikroTik router integration

The static `billing-ui/` router page is a UX mockup: router addresses, secret
references, and profile mappings are example data only. It does not test a
connection or apply subscriber changes. The browser must never receive router
credentials or connect directly to router management ports.

For a production integration, implement a server-side RouterOS API adapter in
the separate billing service. Prefer API-SSL with certificate verification,
restrict router management access to the backend network, and retrieve
least-privilege credentials from a secret manager. Store only a secret
reference in application configuration. Before implementation, confirm the
RouterOS versions and network reachability, whether subscriber provisioning
uses PPP profiles or Simple Queues, and the approved policy for overdue
accounts, grace periods, suspension, and service restoration. Invoice status
alone must not trigger an automatic disconnect.

### GenieACS integration

The GenieACS page in `billing-ui/` is also a static UX mockup. Its NBI
endpoints, device IDs, and customer links are sample data; sync buttons do not
call GenieACS. In production, access the NBI from the billing backend only,
over a private network. GenieACS NBI deployments may not provide application
authentication by default, so do not expose the NBI publicly: restrict network
access and put an authenticated reverse proxy in front of it where required.
Keep proxy credentials in a secret manager and out of browser code.

Use a stable GenieACS device ID within a configured ACS instance as a device
reference, but require operator verification when associating it with a billing
account. Make inventory reads and any future provisioning actions auditable
and retry-safe. Confirm the installed GenieACS version and supported NBI
operations before implementing the adapter; do not assume an undocumented API
or allow billing status alone to trigger CPE configuration changes.

Once an actual GenieACS deployment configuration and the service contract are
available, this repository may add the smallest necessary service wiring,
configuration examples, and deployment documentation. Credentials and
environment-specific values must be supplied through deployment secrets, not
committed configuration.

## Initial validation

- Unit-test invoice-period eligibility and invoice plan snapshots.
- Integration-test migrations and invoice creation against the chosen
  relational database.
- Test that rerunning the job for the same account and period never duplicates
  an invoice, including concurrent/retried runs.
- Validate the built service image and its deployment configuration in the
  billing service project; validate any later GenieACS deployment wiring here.
