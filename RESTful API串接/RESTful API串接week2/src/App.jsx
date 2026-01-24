import { useState } from 'react'
// #12安裝axios: npm install axios
// #13
import axios from 'axios'

// #11 貼上路徑
const url = 'https://ec-course-api.hexschool.io/v2';
const apiPath = 'peijinhexhw';

function App() {
  // #4 useState
  const [data, setData] = useState({
    username: '',
    password: ''
  })
  // #2 login
  async function login() {
    console.log(axios);
    
    // #10 發送API至遠端並登入 (並儲存Token)
    const res = await axios.post(`${url}/admin/signin`, data)
    console.log(res);
    // try {
    //   //console.log(res);

    //   //取得token
    //   const { token, expired } = res.data;
    //   console.log(token, expired);

    //   //儲存Token到cookie
    //   document.cookie = `hexToken=${token}; expired=${new Date(expired)};`;
    //   console.log(expired);

    // } catch (error) {
    //   console.log(error);
    // }
  }
  // #9 把輸入框一樣的程式碼寫成函式 (#7,#8用eventHandler )
  function eventHandler(e) {
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value
    })
  }
  return (
    <>
      <div>
        {/* #5 把JSON轉成字串, 因React 不能直接渲染「物件 (Object)」  
        {
          JSON.stringify(data)
        } */}
        {/* #1 畫面呈現input框, 按鈕架構*/} {/* #6 input框加上onChange 事件監聽*/} {/* #9 name屬性 */}
        <input type="email" id="email" name='username' onChange={(e) => {
          eventHandler(e)
          // #7 取出輸入框裡的值
          // const {value, name} = e.target;

          // // #8 setData把值寫進去
          // setData({
          //   ...data,
          //   [name]: value
          // })
        }} />
        <input type="password" id="password" name='password' onChange={(e) => {
          eventHandler(e)
          // const {value, name} = e.target;
          // setData({
          //   ...data,
          //   [name]: value
          // })
        }} />

        <button type="button" id="login" onClick={() => login()}>登入</button>  {/* #3 login加上onClick 事件監聽*/}
      </div>

      <div>
        <button type="button" id="check">確認是否登入</button>
        <button type="button" id="getProducts">取得後台產品列表</button>
      </div>
    </>
  )


}

export default App
