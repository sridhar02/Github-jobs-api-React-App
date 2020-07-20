import React, { useState } from "react";
import useFetchJobs from "./UseFetchJobs.js";
import { Container } from "react-bootstrap";

import Job from "./Job.js";
import JobsPagination from "./JobsPagination.js";

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error } = useFetchJobs(params, page);
  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <JobsPagination page={page} setPage={setPage} hasNextPage={true} />
      {loading && <h1>Loading... </h1>}
      {error && <h1>Error. Try Refreshing.</h1>}
      {jobs && jobs.map((job) => <Job key={job.id} job={job} />)}
      <JobsPagination page={page} setPage={setPage} hasNextPage={true} />
    </Container>
  );
}

export default App;
