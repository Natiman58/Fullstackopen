const Header = ({ courses }) => <h2>{courses}</h2>

const Total = ({ sum }) => <h2>Total of {sum} exercises</h2>

const Part = ({part}) => <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {
  return parts.map((part) => <Part key={part.id} part={part} />)
}


const Course = ({courses}) => {
    return courses.map((course)=>{
      const sum = course.parts.reduce((sum, part) => sum + part.exercises, 0)
      return (
        <div key={course.id}>
          <Header courses={course.name} />
          <Content parts={course.parts} />
          <Total sum={sum} />
        </div>
      )
    })
  }

export default Course