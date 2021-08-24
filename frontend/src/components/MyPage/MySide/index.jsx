import React, {useState, useEffect, useContext} from 'react';
import {
  Button,
  makeStyles,
  Grid,
  Paper,
  Typography,
  AppBar,
  Box,
} from '@material-ui/core';
import { CommonContext } from '../../../context/CommonContext';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  sidebarAboutBox: {
    width: "90%",
    padding: 15,
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
    margin:20
  },
  toolbar: {
    minHeight: 125,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    margin: 20,
  },
  ingredeintRoot: {
    padding: theme.spacing(1, 1),
    margin: 10,
    height: 35,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  ingredientComp: {
    margin: 15,
    height: 65,
    flexGrow: 1,
    textAlign: 'center',
    align: 'justify',
    fontSize : 30,
  },
  buttonComp: {
    margin:5,
    padding: 1,
    fontSize: 30,
  },
  sidenavComp: {
    overflow: 'hidden',
  },
  floatLeft: {
    float:'left',
  },
  floatRight: {
    float:'right',
  }
}));

const MyBar = () => {
  const classes = useStyles();
  const {ingredients, setIngredients, setOpenFoodAdd} = useContext(CommonContext);
  const [editBtn, setEditBtn] = useState('편집');
  const moment = require('moment');
  const today = ((moment()).format('YYYYMMDD')).substr(0, 10);

  useEffect(()=>{
    ingredientApi();
  },[])

  // 재료 DB GET
  const ingredientApi =()=>{
    axios.get('/user/myingredients')
    .then(res=>{
      console.log(res.data,'ingredi-get-res')
      // 재료 데이터 수정 yy.mm.dd.Txx:xx:xx -> yy.mm.dd
      for (let i=0; i<res.data.length; i++){
        res.data[i].expiration_date=res.data[i].expiration_date.substr(0, 10)
      }
      setIngredients(res.data);
      iotApi();
    })
  };

  // 재료 DB DEL
  const delIngredient=(params)=>{
    console.log(params, 'del-food-data')
    axios.post('/user/myingredients/delete',params)
      .then(res=>{
        console.log(res,'delFood-res')
        ingredientApi();
        iotApi();
      })
      .catch(err=>{
        console.log(err.response, 'delFood-err')
      })
  }

  // iot
  const iotApi =()=>{
    axios.get('/iot/led')
      .then(res=>{
        console.log(res, 'iot-res')
      })
  };

  return (
    <Grid item xs={12} md={4} className={classes.ComponentsGrid}>
      <AppBar position='sticky' className={classes.toolbar}>
        <Paper elevation={0} className={classes.sidebarAboutBox}>
          <div className={classes.sidenavComp}>
            <Typography variant="h4" gutterBottom className={classes.floatLeft}>
              보유중인 재료
            </Typography>
            {/* 버튼 */}
            {editBtn === '추가' ?
              <div className={classes.floatRight}>
                <Button onClick={()=>{setOpenFoodAdd(true)}} variant="outlined" className={classes.buttonComp}>
                  {editBtn}
                </Button>
                <Button onClick={()=>{setEditBtn('편집')}} variant="outlined" className={classes.buttonComp}>
                  완료
                </Button>
              </div>
              :
              <div className={classes.floatRight}>
                <Button onClick={() => { setEditBtn('추가') }} variant="outlined" className={classes.buttonComp}>
                  {editBtn}
                </Button>
              </div>
            }
            {/* 색깔 */}
          </div>
            {editBtn === '추가' ?
              <div>
              {ingredients.map((ingredient) => (
                  <Paper className={classes.ingredeintRoot} color='error'>
                    {
                    Number((moment(ingredient.expiration_date).format('YYYYMMDD')).substr(0,10))<Number(today)+3
                    ?
                    <Typography className={classes.ingredientComp} color='error'>
                      <Grid>
                        {ingredient.ingredient_name} {ingredient.expiration_date}
                      <Button onClick={()=>{delIngredient(ingredient)}} color="secondary">
                        삭제
                      </Button>
                      </Grid>
                    </Typography>
                    :
                    <Typography className={classes.ingredientComp}>
                      {ingredient.ingredient_name} {ingredient.expiration_date}  
                      <Button onClick={()=>{delIngredient(ingredient)}} color="secondary">
                        삭제
                      </Button>
                    </Typography>
                    }
                    
                  </Paper>
                ))}
              </div>
            :
              <div>
                {ingredients.map((ingredient)=>(
                  <Paper className={classes.ingredeintRoot} >
                  {/* <Paper> */}
                    {
                    Number((moment(ingredient.expiration_date).format('YYYYMMDD')).substr(0,10))<Number(today)+3
                    ?
                    <Typography className={classes.ingredientComp} color='error'>
                      <Grid>
                        {ingredient.ingredient_name} {ingredient.expiration_date}
                      </Grid>
                    </Typography>
                    :
                    <Typography className={classes.ingredientComp}>
                      {ingredient.ingredient_name} {ingredient.expiration_date} 
                    </Typography>
                    }
                  </Paper>
                ))}
              </div>
            }
          </Paper>
        {/* </ToolBar> */}
      </AppBar>
    </Grid>
  );
}

export default MyBar;