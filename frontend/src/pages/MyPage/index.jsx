import React, {useContext, useEffect} from 'react';
import {Grid} from '@material-ui/core';
import MyPageBack from '../../components/MyPage/MyBack';
import MyPageCard from '../../components/MyPage/MyCard';
import MyBar from '../../components/MyPage/MySide';
import FoodAdd from '../../components/Foods/FoodAdd';
import { CommonContext } from '../../context/CommonContext';
import Layout from '../../layout';


const Mypage = () => {
  const {openFoodAdd, setOpenFoodAdd} = useContext(CommonContext);
  // 들어왔을때 항상 닫혀있도록
  useEffect(()=>{
    setOpenFoodAdd(false);
  }, []);

  return (
    <Layout >
      <main style={{minHeight:'100vh',margin: '0px 0px -23px 0px'}}>
        { 
        openFoodAdd
        ?
        <FoodAdd />
        :
        <div>
        <MyPageBack />
        <Grid container spaicng={5} justifyContent="center">
          <MyPageCard />
          <MyBar />
        </Grid>
        </div>
        }
      </main>
    </Layout>
  );
};

export default Mypage;