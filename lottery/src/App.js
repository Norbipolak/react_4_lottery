import './App.css';
import Lottery from './components/Lottery';

// const arr = new Array(90);
// console.log(...arr.keys());

// const obj = {"key1":0, "key2":1, "key3":2};
// console.log(Object.keys(obj));

function App() {
    return(
        <div className='container'>
            <Lottery/>
        </div>
    );
}

export default App;
