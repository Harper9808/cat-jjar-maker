import './App.css';
import Title from './components/Title';

import React from 'react';

const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};


function CatItem({ img }) {
  return (
    <li>
      <img
        src={img}
        alt="고양이" style={{ width: '150px' }}
      />
    </li>
  )
}
function Favorites({ favorits }) {
  if (favorits.length === 0) {
    return <div>사진 위 하트를 눌러 저장해 보세요</div>
  }
  return (
    <ul className="favorites">
      {favorits.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  )
}
//Arrow Funcion 사용해서 만든 컴포넌트
const MainCard = ({ img, onHartClick, aleadyFavorit }) => {
  const heartIcon = aleadyFavorit ? "💖" : "🤍"
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHartClick} >{heartIcon}</button>
    </div>
  )
}
const Form = ({ onUpdateMainCat }) => {
  const [value, setValue] = React.useState('')
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [errMessage, seterrMessage] = React.useState('')
  function HandleInputChange(e) {
    const inputText = e.target.value
    seterrMessage('')
    if (includesHangul(inputText)) {
      seterrMessage("한글은 쓸 수 없습니다.")
    }
    //대문자로 변환시켜주기 
    setValue(e.target.value.toUpperCase())
  }
  function handleFormSubmit(e) {
    e.preventDefault()
    seterrMessage('')
    if (value === '') {
      seterrMessage("빈 값으로 만들 수 없습니다.")
      return
    }
    onUpdateMainCat(value)

  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" value={value} onChange={HandleInputChange} name="name" placeholder="영어 대사를 입력해주세요" />
      <button type="submit">생성</button>
      <p style={{ color: 'red' }}>{errMessage}</p>
    </form>
  )
}








function App() {
  //상태 끌어올리기 
  jsonLocalStorage.getItem("counter")
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter")
  });
  //이미지를 관리하는 상태 추가 
  const [mainCat, setMainCat] = React.useState(CAT1)
  //상태를 사용하는 이벤트 핸들러도 끌어올리기 
  const [favorits, setFavorits] = React.useState(() => {
    return jsonLocalStorage.getItem("favorits") || []
  })

  const aleadyFavorit = favorits.includes(mainCat)

  const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
  };


  async function setinitCat() {
    const newCat = await fetchCat("firstCat");
    setMainCat(newCat)
  }


  React.useEffect(() => {
    setinitCat();
  }, [])




  async function updateMainCat(value) {
    const newCat = await fetchCat(value)
    setMainCat(newCat)
    setCounter((prev) => {
      const nextCount = prev + 1
      jsonLocalStorage.setItem('counter', nextCount)
      return nextCount;
    })
  }

  function handleHartClick(e) {
    const nextFavorits = [...favorits, mainCat]
    setFavorits(nextFavorits)
    jsonLocalStorage.setItem("favorits", nextFavorits)
  }
  const setTitle = (counter === null) ? "" : counter + "번째"

  return (
    <div>
      <Title>{setTitle}고양이 가라사대</Title>
      <Form onUpdateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHartClick={handleHartClick} aleadyFavorit={aleadyFavorit} />
      <Favorites favorits={favorits} />
    </div>

  )
}

export default App;
