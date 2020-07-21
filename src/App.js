import React, { useState } from "react";
import useFetchJobs from "./UseFetchJobs.js";
import { Container } from "react-bootstrap";

import Job from "./Job.js";
import SearchForm from "./SearchForm.js";
import JobsPagination from "./JobsPagination.js";

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  function handleChangeParam(e) {
    const param = e.atarget.value;
    const value = e.target.value;
    setPage(1);
    setParams((prevParams) => {
      return { ...prevParams, [param]: value };
    });
  }
  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <SearchForm params={params}  onParamChnage={handleChangeParam}/>
      <JobsPagination page={page} setPage={setPage} hasNextPage={true} />
      {loading && <h1>Loading... </h1>}
      {error && <h1>Error. Try Refreshing.</h1>}
      {jobs && jobs.map((job) => <Job key={job.id} job={job} />)}
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  );
}

export default App;
