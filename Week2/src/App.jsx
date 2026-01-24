import { useState } from 'react';
import axios from "axios";
import "./assets/style.css";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState();

  const eventHandler = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value
    }))
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${API_BASE}/admin/signin`, formData)
      // console.log(response.data);
      const { token, expired } = response.data;
      // console.log(token, expired);
      document.cookie = `hexToken=${token}; expired=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;

      // 登入成功, 取得Token存到cookie, Token放到header, 設定控制畫面的參數設定成true
      setIsAuth(true);
      getProducts();


    } catch (error) {
      setIsAuth(false);
      console.log(error.response);
    }
  }

  const checkLogin = async (e) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`${API_BASE}/api/user/check`)
      console.log(response);

    } catch (error) {
      console.log(error);

    }
  }

  const getProducts = async (e) => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(response.data.products);
      
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      {!isAuth ? (
        <div className='container login'>
          <h1>請先登入</h1>
          <form className='form-floating' onSubmit={(e) => onSubmit(e)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={(e) => { eventHandler(e) }} />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => { eventHandler(e) }} />
              <label htmlFor="password">Password</label>
            </div>
            <button type='submit' className='btn btn-primary w-100 mt-2'>登入</button>
          </form >
        </div>
      ) : (
        <div className='container'>
          <button
            className="btn btn-danger mb-5"
            type="button"
            onClick={() => checkLogin()}
          >
            確認是否登入
          </button>
          <div className="row">
            <div className="col-6">
              <h2>滑雪場列表</h2>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">雪場名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">查看明細</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          //點下去的產品要存在setTempProduct
                          onClick={() => setTempProduct(product)}>查看</button></td>
                    </tr>
                  ))}


                </tbody>
              </table>


            </div>
            <div className="col-6">
              <h2>雪場明細</h2>
              {
                //當 tempProduct 是 undefined（初始狀態）時：
                // JavaScript 會判定 undefined 為「假 (false)」。這時 React 就不會去執行括號 () 裡的卡片內容，而是跳到最後面顯示 <p>請點擊按鈕</p>
                tempProduct ? (<div className="card">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top"
                    style={{ height: "300px" }}
                    alt="主圖" />
                  <div className="card-body">
                    <h5 className="card-title">名稱 : {tempProduct.title}</h5>
                    <p className="card-text">地點 : {tempProduct.category}</p>
                    <p className="card-text">描述 : {tempProduct.description}</p>
                    <p className="card-text">介紹 : {tempProduct.content}</p>
                    <p className="card-text">日中卷 : {tempProduct.price} {tempProduct.unit}</p>
                    

                    {/* <div className="d-flex">
                       {tempProduct.price} {tempProduct.unit} */}
                    {/* </div> */}
                    <h5 className="card-title">更多圖片</h5>
                    <div className="d-flex flex-wrap">
                      {
                        tempProduct.imagesUrl?.map((url, index) => (
                          <img key={index}
                            src={url}
                            style={{ height: "100px", margin: "5px" }}
                          />
                        ))
                      }
                    </div>

                  </div>
                </div>) : <p>請點擊按鈕</p>
              }


            </div>
          </div>
        </div>
      )
      }
    </>

  );
}

export default App
