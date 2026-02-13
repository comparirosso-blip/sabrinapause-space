import { calculateSDIndex } from '../src/lib/sd-calculator.js';

async function runTests() {
    console.log('🧪 Running SD-Index™ Formula Verification...\n');

    const tests = [
        {
            name: 'Base score for default inputs',
            input: { lux: null, texture: null, noise: [] },
            expected: 5.0
        },
        {
            name: 'Low light (lux < 100) bonus',
            input: { lux: 50, texture: null, noise: [] },
            expected: 6.0
        },
        {
            name: 'Harsh sunlight (lux > 2000) penalty',
            input: { lux: 3000, texture: null, noise: [] },
            expected: 4.5
        },
        {
            name: 'Snow texture bonus',
            input: { lux: null, texture: 'Snow', noise: [] },
            expected: 6.5
        },
        {
            name: 'Moss texture bonus',
            input: { lux: null, texture: 'Moss', noise: [] },
            expected: 6.0
        },
        {
            name: 'Concrete texture penalty',
            input: { lux: null, texture: 'Concrete', noise: [] },
            expected: 4.0
        },
        {
            name: 'Traffic noise penalty',
            input: { lux: null, texture: null, noise: ['Traffic'] },
            expected: 3.0
        },
        {
            name: 'Combined factors (Lux + Texture)',
            input: { lux: 50, texture: 'Snow', noise: [] },
            expected: 7.8
        }
    ];

    let passedCount = 0;

    tests.forEach(test => {
        const result = calculateSDIndex(test.input);
        if (result === test.expected) {
            console.log(`✅ Passed: ${test.name}`);
            passedCount++;
        } else {
            console.error(`❌ Failed: ${test.name}`);
            console.error(`   Expected: ${test.expected}, Got: ${result}`);
        }
    });

    console.log(`\n📊 Results: ${passedCount}/${tests.length} tests passed`);

    if (passedCount === tests.length) {
        console.log('✨ All SD-Index calculations are accurate to specification!\n');
        process.exit(0);
    } else {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test runner failed:', err);
    process.exit(1);
});
