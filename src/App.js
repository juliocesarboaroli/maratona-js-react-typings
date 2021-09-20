import React, { useState, useEffect, useRef } from "react";
import wordList from './resources/words.json';

const MAX_TYPED_KEYS = 30;
const WORD_ANIMATION_INTERVAL = 200;

const getWord = () => {
    const index = Math.floor(Math.random() * wordList.length)
    const word = wordList[index]
    return word.toLowerCase()
}

const isValidKey = (key, word) => {
    if (!word) return false
    return word.split('').includes(key)
}

const Word = ({ word, validKeys }) => {
    // Porque um componente deve retornar null ou o jsx
    if (!word) return null

    const joinedKeys = validKeys.join('')
    const matched = word.slice(0, validKeys.length)
    const remainder = word.slice(validKeys.length)

    const matchedClass = (joinedKeys === word) ? 'matched completed': ''; 

    return (
        <>
            <span className={matchedClass}>{matched}</span>
            <span className="remainder">{remainder}</span>
        </>
    )
}

const App = () => {

    const [typedKeys, setTypedKeys] = useState([])
    const [validKeys, setValidkeys] = useState([])
    const [completedWords, setCompletedWords] = useState([])
    const [word, setWord] = useState('')
    const containerRef = useRef(null)

    // Para rodar ao inicializar
    useEffect(() => {
        setWord(getWord())
        if (containerRef) containerRef.current.focus()
    }, [])

    useEffect(() => {
        const wordFromValidKeys = validKeys.join('').toLowerCase();
        let timeout = null;
        if (word && word === wordFromValidKeys) {
            timeout = setTimeout(() => {
                let newWord = null
                do {
                    newWord = getWord()
                } while(completedWords.includes(newWord))
                setWord(newWord)
                setValidkeys([])
                setCompletedWords((prev) => [...prev, word])
            }, WORD_ANIMATION_INTERVAL)
        }
        
        // Para limpar o timeout. Necessidade do React. Vide documentação do useEffect
        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [word, validKeys, completedWords])

    const handleKeyDown = (e) => {
        e.preventDefault()
        const { key } = e;
        setTypedKeys((prevTypedKeys) => [...prevTypedKeys, key].slice(MAX_TYPED_KEYS * -1))

        if (isValidKey(key, word)) {
            setValidkeys((prev) => {
                const isValidLength = prev.length <= word.length
                const isNextChar = isValidLength && word[prev.length] === key
                return isNextChar ? [...prev, key] : prev
            })
        }
    }

    return (
        // Passado o tabIndex para o react entender o evento, já que div não é um elemento de input
    <div className="container" tabIndex="0" onKeyDown={handleKeyDown} ref={containerRef}>
        <div className="valid-keys">
            <Word word={word} validKeys={validKeys}/>
        </div>
        <div className="typed-keys">{typedKeys ? typedKeys.join(' ') : null}</div>
        <div className="completed-words">
            <ol>
                {completedWords.map((word) => (
                    <li key={word}>{word}</li>
                ))}
            </ol>
        </div>
    </div>)
}

export default App;