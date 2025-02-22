import { useState } from 'react'

const Button = ({onClick, text}) => {
  return <button onClick={onClick}>
    {text}
  </button>
}

const StatisticRow = ({text, value, isPercent}) => {
  if(isPercent)
    return <tr>
      <td>{text}</td>
      <td>{value}%</td>
    </tr>
  return <tr>
    <td>{text}</td> 
    <td>{value}</td>
  </tr>
}

const Statistics = ({good, neutral, bad, all, average, positive, total}) => {
  if(total === 0)
    return <p>
      No Feedback Given
    </p>
  return <table>
    <tbody  >
      <StatisticRow text="Good " value={good}/>
      <StatisticRow text="Neutral " value={neutral}/>
      <StatisticRow text="Bad " value={bad}/>
      <StatisticRow text="All " value={all}/>

      <StatisticRow text="Average " value={average}/>
      <StatisticRow text="Positive " value={positive} isPercent={true}/>
    </tbody>
    
  </table>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(1)

  const handleGoodButton = () => {
    const newValue = good + 1
    const newTotal = total + 1
    console.log("New Good value: ", newValue)
    setGood(newValue)
    setTotal(newTotal)
    setAverage((newValue * 1 + neutral * 0 + bad * -1)/newTotal)
    if(newTotal != 0)
      setPositive((newValue*100)/newTotal)
  }

  const handleNeutralButton = () => {
    const newValue = neutral + 1
    const newTotal = total + 1
    console.log("New Neutral value: ", newValue)
    setNeutral(newValue)
    setTotal(newTotal)
    setAverage((good * 1 + newValue * 0 + bad * -1)/newTotal)
    if(newTotal != 0)
      setPositive((good*100)/newTotal)
  }

  const handleBadButton = () => {
    const newValue = bad + 1
    const newTotal = total + 1
    console.log("New Bad value: ", newValue)
    setBad(newValue)
    setTotal(newTotal)
    setAverage((good * 1 + neutral * 0 + newValue * -1)/total)
    if(newTotal != 0)
      setPositive((good*100)/newTotal)
  }

  return (
    <div>
      <h1>
        give feedback
      </h1>
      <Button onClick={handleGoodButton} text="good"/>
      <Button onClick={handleNeutralButton} text="neutral"/>
      <Button onClick={handleBadButton} text="bad"/>
      <h1>
        Statistics
      </h1>
      <Statistics good={good} neutral={neutral} bad={bad} all={total} average={average} positive={positive} total={total}/>

    </div>
  )
}

export default App