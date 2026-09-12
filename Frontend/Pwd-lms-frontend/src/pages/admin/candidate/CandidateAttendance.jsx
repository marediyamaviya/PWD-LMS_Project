import { Link } from "react-router-dom";

function CandidateAttendance() {

  // Temporary attendance data
  // Later this will come from Spring Boot API
  const attendance = [
    {
      id: 1,
      course: "Java Programming",
      totalClasses: 30,
      attended: 25,
      percentage: 83
    },
    {
      id: 2,
      course: "Spring Boot",
      totalClasses: 20,
      attended: 16,
      percentage: 80
    },
    {
      id: 3,
      course: "React JS",
      totalClasses: 25,
      attended: 22,
      percentage: 88
    }
  ];

  // Calculate overall attendance
  const totalClasses = attendance.reduce(
    (total, item) => total + item.totalClasses,
    0
  );

  const totalAttended = attendance.reduce(
    (total, item) => total + item.attended,
    0
  );

  const overallPercentage = Math.round(
    (totalAttended / totalClasses) * 100
  );

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            My Attendance
          </h2>

          <p className="text-muted mb-0">
            View your attendance for enrolled courses.
          </p>
        </div>

        <Link
          to="/candidate/dashboard"
          className="btn btn-secondary"
        >
          Back to Dashboard
        </Link>

      </div>

      {/* Overall Attendance */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="fw-bold">
            Overall Attendance
          </h5>

          <h2 className="mt-3">
            {overallPercentage}%
          </h2>

          <div className="progress mt-3">

            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${overallPercentage}%`
              }}
            >
            </div>

          </div>

          <p className="text-muted mt-2 mb-0">
            Attended {totalAttended} out of {totalClasses} classes
          </p>

        </div>

      </div>

      {/* Course Attendance */}
      <div className="card shadow-sm">

        <div className="card-body">

          <h5 className="fw-bold mb-4">
            Course-wise Attendance
          </h5>

          <div className="table-responsive">

            <table className="table table-bordered table-hover">

              <thead className="table-light">

                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Total Classes</th>
                  <th>Attended</th>
                  <th>Attendance</th>
                </tr>

              </thead>

              <tbody>

                {attendance.map((item) => (

                  <tr key={item.id}>

                    <td>
                      {item.id}
                    </td>

                    <td className="fw-semibold">
                      {item.course}
                    </td>

                    <td>
                      {item.totalClasses}
                    </td>

                    <td>
                      {item.attended}
                    </td>

                    <td>

                      <div className="d-flex align-items-center">

                        <div
                          className="progress flex-grow-1 me-3"
                          style={{ height: "8px" }}
                        >

                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${item.percentage}%`
                            }}
                          >
                          </div>

                        </div>

                        <span>
                          {item.percentage}%
                        </span>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CandidateAttendance;