import { test, expect } from '@playwright/test';
import { CodeminalCLI } from '../../src/cli';
import { ProjectTemplate } from '../../src/types';

test.describe('Codeminal E2E Workflow', () => {
  let cli: CodeminalCLI;

  test.beforeEach(async () => {
    cli = await CodeminalCLI.create({
      headless: true,
      mockAI: process.env.CI === 'true'
    });
  });

  test('should create and deploy a full-stack project', async () => {
    // Initialize project
    const projectResult = await cli.executeCommand('create full-stack-app --modern');
    expect(projectResult.success).toBeTruthy();
    expect(projectResult.files).toContain('package.json');
    
    // Verify project structure
    const structure = await cli.getProjectStructure();
    expect(structure).toMatchSnapshot('modern-fullstack-structure');
    
    // Test development workflow
    await test.step('development workflow', async () => {
      const devServer = await cli.startDev();
      const response = await fetch('http://localhost:3000');
      expect(response.status).toBe(200);
      await devServer.stop();
    });

    // Test build process
    await test.step('build process', async () => {
      const buildResult = await cli.build();
      expect(buildResult.success).toBeTruthy();
      expect(buildResult.size).toBeLessThan(5000000); // 5MB limit
    });

    // Test AI features
    await test.step('ai assistance', async () => {
      const suggestion = await cli.getAISuggestion('optimize performance');
      expect(suggestion.score).toBeGreaterThan(0.8);
    });
  });

  test('should handle errors gracefully', async () => {
    await expect(
      cli.executeCommand('invalid-command')
    ).rejects.toThrow(/Unknown command/);
  });

  test('should support real-time collaboration', async () => {
    const session = await cli.createCollabSession();
    expect(session.url).toMatch(/^https:\/\/codeminal\.dev\/collab\//);
    
    await test.step('multiple users', async () => {
      const user1 = await session.connectUser('Alice');
      const user2 = await session.connectUser('Bob');
      
      await user1.editFile('src/App.tsx', '// New comment');
      await expect(
        user2.getFileContent('src/App.tsx')
      ).resolves.toContain('// New comment');
    });
  });
});