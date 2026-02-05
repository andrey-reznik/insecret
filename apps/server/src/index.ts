import { cors } from '@elysiajs/cors'
import { createContext } from '@insecret/api/context'
import { appRouter } from '@insecret/api/routers/index'
import { auth } from '@insecret/auth'
import { env } from '@insecret/env/server'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { Elysia } from 'elysia'

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsProvider: 'scalar',
      docsPath: '/scalar',
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specPath: '/spec.json',
      docsConfig: {
        theme: 'elysiajs',
      },
      specGenerateOptions: {
        info: {
          title: 'Insecret API',
          version: '1.0.0',
        },
        servers: [{ url: '/' }],
      },
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
})

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  )
  .all('/api/auth/*', async (context) => {
    const { request, status } = context
    if (['POST', 'GET'].includes(request.method)) {
      return await auth.handler(request)
    }
    return status(405)
  })
  .all('/api*', async (context) => {
    const { response } = await apiHandler.handle(context.request, {
      context: await createContext({ context }),
    })
    return response ?? new Response('Not Found', { status: 404 })
  })
  .all('/rpc*', async (context) => {
    const { response } = await rpcHandler.handle(context.request, {
      prefix: '/rpc',
      context: await createContext({ context }),
    })
    return response ?? new Response('Not Found', { status: 404 })
  })
  .all('/scalar*', async (context) => {
    const { response } = await apiHandler.handle(context.request, {
      context: await createContext({ context }),
    })
    return response ?? new Response('Not Found', { status: 404 })
  })
  .all('/spec.json', async (context) => {
    const { response } = await apiHandler.handle(context.request, {
      context: await createContext({ context }),
    })
    return response ?? new Response('Not Found', { status: 404 })
  })
  .get('/', () => 'OK')

app.onStart(({ server }) => {
  console.log(`🔐 Server is running on http://localhost:${server?.port}`)
})

app.listen(4000)
