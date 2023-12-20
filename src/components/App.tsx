import { Route, Routes } from "react-router-dom";

import Collection from "./Collection";
import Creation from "./Creation";
import Layout from "./Layout";
import Select from "./Select";
import Start from "./Start";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Start />} />
        <Route path="selection" element={<Select />} />
        <Route path="collection" element={<Collection />} />
        <Route path="creation" element={<Creation />} />
      </Route>
    </Routes>
  );
}

export default App;
