import Button from './Components/Button'
import Display from './Components/Display'


const App = () => {
  return (
    <div>
        <Display />
        <div>
            <Button type='INC' label='+'/>
            <Button type='DEC' label='-'/>
            <Button type='ZERO' label='0'/>
        </div>
    </div>
  )
}

export default App