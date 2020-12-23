const fs = require('fs');

const input = fs.readFileSync('./puzzle-input.txt', 'utf-8');
const puzzleInput = input.trim().split('\n\n');
const rules = puzzleInput[0].split('\n');
const receivedMessages = puzzleInput[1].split('\n');

function expandRule(rule, rulesMap) {
    const expanded = [];

    ruleExpander(rule, rulesMap);

    function ruleExpander(rule, rulesMap) {
        const resp = /(?<digit>\d+)/.exec(rule);

        if (!resp) {
            expanded.push(rule);
            return;
        } else {
            const { digit } = resp.groups;
            const value = rulesMap.get(digit);

            if (Array.isArray(value)) {
                value.forEach((v) => {
                    const newRule = rule.toString().replace(digit, v);
                    ruleExpander(newRule, rulesMap);
                });
            } else {
                const newRule = rule.toString().replace(digit, value);
                ruleExpander(newRule, rulesMap);

            }
        }
    }

    return expanded.map((exp) => exp.replace(/\s/g, ''));
}

function answerPartOne() {
    const rulesMap = new Map();

    rules.forEach((rule) => {
        const key = rule.split(': ')[0];
        let value = rule.split(': ')[1];

        if (value.startsWith('"')) {
            value = value.replace(/"/g, '');
        } else if (value.includes('|')) {
            value = value.split('|').map((s) => s.trim());
        }

        rulesMap.set(key, value);
    });

    // rulesMap.set('8', ['42', '42 8']);
    // rulesMap.set('11', ['42 31', '42 11 31']);

    const rule0 = rulesMap.get('0');
    let expandedRule0;

    if (Array.isArray(rule0)) {
        expandedRule0 = rule0.reduce((acc, cur) => acc.concat(expandRule(cur, rulesMap)), []);
    } else {
        expandedRule0 = expandRule(rule0, rulesMap);
    }

    const matchingMessages = expandedRule0.filter((exp) => receivedMessages.includes(exp));

    return matchingMessages.length;
}

console.log('How many messages completely match rule 0?', answerPartOne());

