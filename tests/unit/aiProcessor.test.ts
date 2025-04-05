import { AIProcessor } from '../../src/core/aiProcessor';
import { expect, jest, test, describe, beforeEach } from '@jest/globals';

describe('AIProcessor', () => {
  let processor: AIProcessor;

  beforeEach(() => {
    processor = new AIProcessor({
      apiKey: 'test-key',
      model: 'gpt-5-turbo-0325'
    });
  });

  test('should process task and generate blueprint with metadata', async () => {
    const result = await processor.processTask('Create React component');
    
    expect(result).toBeDefined();
    expect(result.blueprint).toBeTruthy();
    expect(result.metadata.confidence).toBeGreaterThan(0.8);
    expect(result.metadata.processingTime).toBeGreaterThan(0);
    expect(result.metadata.modelVersion).toBe('gpt-5-turbo-0325');
  });

  test('should handle optimization tasks with detailed suggestions', async () => {
    const result = await processor.processTask('Optimize performance');
    
    expect(result.optimizations).toContain('tree-shaking');
    expect(result.suggestions).toHaveLength(3);
    expect(result.metadata.confidence).toBeGreaterThan(0.9);
  });

  test('should throw error for empty task', async () => {
    await expect(processor.processTask('')).rejects.toThrow('Task description cannot be empty');
  });

  test('should validate code correctly', async () => {
    const validCode = 'function test() { return true; }';
    const result = await processor.validateCode(validCode);
    expect(result).toBe(true);
  });

  test('should suggest improvements for code', async () => {
    const code = 'function myComponent() { return <div>Test</div>; }';
    const suggestions = await processor.suggestImprovements(code);
    expect(suggestions).toBeInstanceOf(Array);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  test('should include processing time in metadata', async () => {
    const startTime = Date.now();
    const result = await processor.processTask('Test task');
    
    expect(result.metadata.processingTime).toBeDefined();
    expect(result.metadata.processingTime).toBeLessThanOrEqual(Date.now() - startTime);
  });
});