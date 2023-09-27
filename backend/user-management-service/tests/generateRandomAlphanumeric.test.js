import generateRandomAlphanumeric from '../controllers/generateRandomAlphanumeric';

describe('generateRandomAlphanumeric', () => {
  test('should generate a random alphanumeric string of the specified length', () => {
   
    const length1 = 10;
    const length2 = 15;
    const length3 = 5;

    const result1 = generateRandomAlphanumeric(length1);
    const result2 = generateRandomAlphanumeric(length2);
    const result3 = generateRandomAlphanumeric(length3);

    
    expect(result1).toHaveLength(length1);
    expect(result2).toHaveLength(length2);
    expect(result3).toHaveLength(length3);

    expect(result1).toMatch(/^[A-Za-z0-9]+$/); 
    expect(result2).toMatch(/^[A-Za-z0-9]+$/); 
    expect(result3).toMatch(/^[A-Za-z0-9]+$/); 
  });

  test('should return an empty string if length is 0', () => {
    const result = generateRandomAlphanumeric(0);
    expect(result).toBe('');
  });

  test('should return an empty string if length is negative', () => {
    const result = generateRandomAlphanumeric(-10);
    expect(result).toBe('');
  });

  test('should return an empty string if length is not a number', () => {
    const result1 = generateRandomAlphanumeric('10');
    const result2 = generateRandomAlphanumeric(null);
    const result3 = generateRandomAlphanumeric(undefined);

    expect(result1).toBe(RegExp('*'));
    expect(result2).toBe(RegExp('*'));
    expect(result3).toBe(RegExp('*'));
  });
});
