import React, { useState, useEffect } from "react";
import wordList from './resources/words.json';

const MAX_TYPED_KEYS = 30;

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

    return (
        <>
            <span className="matched">{matched}</span>
            <span className="remainder">{remainder}</span>
        </>
    )
}

const App = () => {

    const [typedKeys, setTypedKeys] = useState([])
    const [validKeys, setValidkeys] = useState([])
    const [word, setWord] = useState('')

    // Para rodar ao inicializar
    useEffect(() => {
        setWord(getWord())
    }, [])

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
    <div className="container" tabIndex="0" onKeyDown={handleKeyDown}>
        <div className="valid-keys">
            <Word word={word} validKeys={validKeys}/>
        </div>
        <div className="typed-keys">{typedKeys ? typedKeys.join(' ') : null}</div>
        <div className="completed-words">
            <ol>
                <li>cidade</li>
                <li>carro</li>
                <li>moto</li>
            </ol>
        </div>
    </div>)
}

export default App;