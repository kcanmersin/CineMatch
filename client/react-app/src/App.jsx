
import "./App2.css"
import Background from "./Components/FirstPage/Background"
import {Routes, Route} from "react-router-dom"
import SignupPage from "./Components/SignupPage"
function App() {
    return(
      <Routes>
        <Route path="/" element={<Background />}/>
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

    )
}

export default App
