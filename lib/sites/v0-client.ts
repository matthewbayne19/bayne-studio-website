import { config } from "dotenv"
config({ path: ".env.local" })

import { Agent, setGlobalDispatcher } from "undici"

// Node's default fetch timeout is too short for v0 operations that can run
// for several minutes (generation, refinement, deployment). Without this,
// Node kills the connection before v0's server responds
// (UND_ERR_HEADERS_TIMEOUT / UND_ERR_SOCKET), even though the operation
// itself may still be working fine server-side. This must run before the
// v0 client below makes its first request.
setGlobalDispatcher(
  new Agent({
    headersTimeout: 10 * 60 * 1000, // 10 minutes
    bodyTimeout: 10 * 60 * 1000,
  }),
)

import { createV0Client } from "v0"

// Built explicitly (not the default `v0` singleton export) because the
// singleton reads process.env at import time - before config() above gets
// a chance to run, due to how ES module imports are hoisted ahead of a
// module's own top-level code. This construction order avoids that.
export const v0 = createV0Client({ auth: process.env.V0_API_KEY! })
