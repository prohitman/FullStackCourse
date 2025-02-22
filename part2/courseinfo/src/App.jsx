import Course from './components/Course';

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  const totalExercises = new Array(courses.length).fill(0);

  courses.forEach((course) => {
    const total = course.parts.reduce((total, currentVal, currentId, arr) => {
      return total + arr[currentId].exercises
    }, 0)
    totalExercises[course.id] = total
  })

  console.log(totalExercises)

  return <div>
    <h1>
      Web Development Curriculum
    </h1>
      <Course courses={courses} total={totalExercises}/>
  </div>
  
}

export default App