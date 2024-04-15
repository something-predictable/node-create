#!/usr/bin/env node

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [major] = process.versions.node.split('.')
if (Number(major) < 20) {
    console.error(
        `You are running Node ${process.versions.node}.\nRiddance requires Node 20 or higher.\nPlease update your version of Node.`,
    )
    process.exit(1)
}

const [, , args] = process.argv

const workDir = join(tmpdir(), 'riddance', 'create', randomUUID())
await mkdir(workDir, { recursive: true })
try {
    await writeFile(join(workDir, 'package.json'), '{}')
    execSync('npm install --progress false @riddance/init@latest', {
        cwd: workDir,
        stdio: 'inherit',
    })
    execSync(
        'node' +
            [join(workDir, 'node_modules', '@riddance', 'init', 'index.js'), ...(args ?? [])]
                .map(arg => ` "${arg}"`)
                .join(''),
        {
            stdio: 'inherit',
        },
    )
} finally {
    await rm(workDir, { recursive: true, force: true })
}
