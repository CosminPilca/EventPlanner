import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function runDatabaseTests() {
  const tests = []

  try {
    await prisma.$connect()
    tests.push({
      name: 'Database Connection',
      status: 'passed',
      message: 'Connected successfully',
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Connection failed'
    tests.push({
      name: 'Database Connection',
      status: 'failed',
      message: errorMessage,
    })
    return tests
  }

  try {
    const version = await prisma.$queryRaw`SELECT sqlite_version() as version`
    //@ts-ignore
    tests.push({
      name: 'SQLite Version',
      status: 'passed',
      message: `Version: ${version[0]?.version}`,
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Version check failed'
    tests.push({
      name: 'SQLite Version',
      status: 'failed',
      message: errorMessage,
    })
  }

  try {
    const [users, events, categories] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.category.count(),
    ])
    tests.push({
      name: 'Table Counts',
      status: 'passed',
      message: `Users: ${users}, Events: ${events}, Categories: ${categories}`,
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Table count failed'
    tests.push({
      name: 'Table Counts',
      status: 'failed',
      message: errorMessage,
    })
  }

  try {
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        role: 'USER',
      },
    })
    await prisma.user.delete({ where: { id: testUser.id } })
    tests.push({
      name: 'Insert/Delete Test',
      status: 'passed',
      message: 'CRUD operations working',
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'CRUD test failed'
    tests.push({
      name: 'Insert/Delete Test',
      status: 'failed',
      message: errorMessage,
    })
  }

  await prisma.$disconnect()
  return tests
}

export default async function TestPage() {
  const testResults = await runDatabaseTests()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Database Connection Tests</h1>

      <div className="space-y-4">
        {testResults.map((test, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              test.status === 'passed'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {test.status === 'passed' ? 'Passed ->' : 'Error ->'}{' '}
                {test.name}
              </h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  test.status === 'passed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {test.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-sm">{test.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 You can also test the API directly at: <code>/api/test-db</code>
        </p>
      </div>
    </div>
  )
}
