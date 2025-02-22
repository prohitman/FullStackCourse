const Course = ({courses, total}) => (
    <ul>
      {
        courses.map((course) => {
          return <li key={course.id}>
            <h2>
              {course.name}
            </h2>
            <ul>
              {
                course.parts.map((part) => {
                  return <li key={part.id}>
                    <>
                      {part.name} {part.exercises}
                    </>
                  </li>
                })
              }
            </ul>
            <b>
              total of {total[course.id]} exercises.
            </b>
          </li>
        })
      }
    </ul>
  )

  export default Course