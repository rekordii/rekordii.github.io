let rules = [];

for (let i = 0; i < 5; i++) {
    rules[i] = document.getElementById(`rule-${i+1}`);
    console.log(`rule-${i+1}`);
}

console.log(rules);

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

await sleep(1000);

for (let i = 0; i < 5; i++) {
    rules[i].style.visibility = "visible";
    if (i === 3) {
        rules[4].scrollIntoView({ behavior : "smooth"});
    }
    await sleep(1000);
}