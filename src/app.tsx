import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const App = () => (
  <>
    <Suspense fallback={<span>Loading...</span>}>
      <Routes>
        <Route path="/" element={<div>Remote A</div>} />
      </Routes>
    </Suspense>
  </>
);

export default App;
