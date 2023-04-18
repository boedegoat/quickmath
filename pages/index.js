import { useEffect, useMemo, useState } from 'react'
import { getRandomNumber } from '@/lib/utils'

const DEFAULT_TIME = 1800
let timeInterval

function ProgressBar({ value, max }) {
    const percent = Math.round((value / max) * 100)

    return (
        <div className='w-full h-1'>
            <div
                style={{
                    width: percent + '%',
                }}
                className='h-full bg-blue-700'
            ></div>
        </div>
    )
}

export default function Home() {
    const [equation, setEquation] = useState({
        left: 0,
        right: 0,
    })
    const [answer, setAnswer] = useState({
        correct: 0,
        wrong: 0,
    })
    const [state, setState] = useState('')
    const [score, setScore] = useState(0)
    const [highscore, setHighscore] = useState(null)
    const [isHighscore, setIsHighscore] = useState(false)
    const [countup, setCountup] = useState(0)

    useEffect(() => {
        if (!localStorage.highscore) {
            localStorage.highscore = 0
        }
        setHighscore(localStorage.highscore)
    }, [])

    const onGameover = () => {
        setState('gameover')
        if (score > highscore) {
            localStorage.highscore = score
            setHighscore(score)
            setIsHighscore(true)
        }
    }

    const randomizeEquation = () => {
        const left = getRandomNumber(2, 9)
        const right = getRandomNumber(11 - left, 9, left)

        setEquation({
            left,
            right,
        })

        const correct = left + right
        const wrong = getRandomNumber(
            correct - 1 === 10 ? correct + 1 : correct - 1,
            correct + 1,
            correct
        )
        setAnswer({
            correct,
            wrong,
        })

        clearInterval(timeInterval)
        setCountup(0)

        timeInterval = setInterval(() => {
            setCountup((c) => {
                const newCountup = c + 10
                if (newCountup >= DEFAULT_TIME) {
                    clearInterval(timeInterval)
                    onGameover()
                }
                return newCountup
            })
        }, 10)
    }

    const onStart = () => {
        randomizeEquation()
        setState('started')
        setScore(0)
        setIsHighscore(false)
    }

    const onAnswer = (answer) => {
        if (answer === 'correct') {
            randomizeEquation()
            setScore((s) => s + 1)
        } else {
            onGameover()
        }
    }

    const onGotoHome = () => {
        setState('')
        setScore(0)
        setIsHighscore(false)
    }

    const randomAnswerPosition = useMemo(
        () =>
            getRandomNumber(0, 1) === 0
                ? ['correct', 'wrong']
                : ['wrong', 'correct'],
        [equation]
    )

    return (
        <main className='h-screen'>
            {state === 'started' && (
                <div className='fixed top-0 left-0 w-full'>
                    <ProgressBar value={countup} max={DEFAULT_TIME} />
                </div>
            )}
            <div className='p-3 max-w-md mx-auto h-full'>
                {!state && (
                    <div className='text-center'>
                        <h1 className='font-bold text-4xl py-6'>Quickmath</h1>
                        <button
                            className='px-7 py-2 text-lg font-medium bg-slate-800 rounded-lg'
                            onClick={onStart}
                        >
                            Start
                        </button>

                        {highscore && (
                            <div className='mt-2 text-gray-400 font-medium'>
                                Highscore: {highscore}
                            </div>
                        )}
                    </div>
                )}
                {state === 'started' && (
                    <div className='text-center flex flex-col h-full'>
                        <div className='text-gray-400'>Score: {score}</div>
                        <div className='text-5xl font-bold py-6 mt-auto'>
                            {equation.left} + {equation.right}
                        </div>
                        <div className='flex space-x-3 mt-auto'>
                            {randomAnswerPosition.map((randomAnswer) => (
                                <button
                                    key={randomAnswer}
                                    className='w-full py-5 text-2xl font-bold bg-slate-800 rounded-lg'
                                    onClick={() => onAnswer(randomAnswer)}
                                >
                                    {answer[randomAnswer]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {state === 'gameover' && (
                    <div className='text-center'>
                        <div className='text-2xl font-bold py-5'>Gameover</div>
                        {isHighscore && <div>New Highscore!</div>}
                        <p>Score: {score}</p>
                        <div className='flex flex-col space-y-3 mt-5'>
                            <button
                                className='px-7 py-2 text-lg font-medium bg-slate-800 rounded-lg'
                                onClick={onStart}
                            >
                                Play Again
                            </button>
                            <button
                                className='px-7 py-2 text-lg font-medium bg-slate-800 rounded-lg'
                                onClick={onGotoHome}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
