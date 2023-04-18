export function getRandomNumber(num1, num2, prohibitNumber = null) {
    let randomNum
    do {
        randomNum = Math.floor(Math.random() * (num2 - num1 + 1) + num1)
    } while (randomNum === prohibitNumber)
    return randomNum
}
