import React, { useContext } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts';
import send_icon from '../../img/send_icon.png'
import user_icon from '../../img/user_icon.png'
import ai_icon from '../../img/ai_icon.png'
import { Context } from '../../context/Context';

function MentalWellness() {
  const {onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context)

  return (
    <MentStyled>
      <InnerLayout className='main'>
        <div className='nav'>
          <h2>Mind-Bot</h2>
        </div>
        <div className="main-container">
          {!showResult
          ?<>
            <div className='greet'>
            <p><span>Hi, there!</span></p>
            <p>How are you feeling today?</p>
            </div>
          </>
          :<div className='result'>
              <div className='result-title'>
                <img src={user_icon} alt=""/>
                <p>{recentPrompt}</p>
              </div>
              <div className='result-data'>
                <img src={ai_icon} alt="AI Assistant"></img>
                {loading
                ?<div className='loader'>
                    <hr/>
                    <hr/>
                    <hr/>
                </div>
                :<p dangerouslySetInnerHTML={{__html:resultData}}></p>
                }
              </div>
            </div>
          }
          <div className='main-bottom'>
            <div className='search-box'>
              <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Share your thoughts here'/>
              <div>
                <img onClick={()=>onSent()} src = {send_icon} alt=""/>

              </div>
            </div>
            <p className='bottom-info'>
              Mind-Bot cannot replace professional help. If you need it, it will guide you towards qualified mental health resources.
            </p>
          </div>
        </div>
      </InnerLayout>
    </MentStyled>  
  )
}

const MentStyled = styled.nav`
  
  .nav h2{
    color: #553C9A;
    font-size: 40px;
    font-weight: 705;
    margin: 11px 12px;
  }
  .main{
      flex: 1;
      min-height: 100vh;
      padding-bottom: 15vh;
      position: relative;
      
  }

  .main .nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    padding: 20px;
    /* color: white; */
  }

  .main-container{
    max-width: 900px;
    /* padding: -70px; */
    margin: -15px 88px;
    color: black;
  }

  .main .greet{
    margin: 50px 0px;
    font-size: 40px;
    color: #928989;
    font-weight: 540;
    padding: 20px;
  }

  .main .greet span{
    background: -webkit-linear-gradient(16deg, #4b90ff, #ff5546);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .main-bottom{
    position: absolute;
    bottom: 0;
    width: 100%;
    max-width: 900px;
    padding: 0px 20px;
    margin: 80px -48px;
  }

  .search-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background-color: #f0f4f9;
    margin: 20px 40px;
    padding: 7px 17px;
    border-radius: 50px;
    /* margin-right: 70px */
  }

  .search-box img{
    width: 24px;
    cursor: pointer;
  }

  .search-box input{
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 9px;
    font-size: 18px;
  }

  .search-box div{
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .main .bottom-info{
    font-size: 13px;
    margin: 15px;
    text-align: center;
    font-weight: 300px;
  }

  .result{
    padding: 0px 5%;
    max-height: 70vh;
    overflow-y: scroll;
  }

  .result::-webkit-scrollbar{
    display: none;
  }

  .result-title{
    margin: 40px 0px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .result img{
    width: 40px;
    border-radius: 50%;
    opacity: 59%;
  }

  .result-data{
    display: flex;
    align-items: start;
    gap: 20px;
  }

  .loader{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .loader hr{
    border-radius: 4px;
    border: none;
    background-color: #f6f7f8;
    background: linear-gradient(to right, #D5A8FF, #f6f7f8, #D5A8FF);
    background-size: 800px 50px;
    height: 20px;
    animation: loader 3s infinite linear;                                                 
  }
  @keyframes loader {
    0%{
      background-position: -800px 0px;
    }
    100%{
      background-position: 800px 0px;
    }
  }
  .result-data p{
    font-size: 17px;
    font-weight: 300;
    line-height: 1.8;
  }
 
`;


export default MentalWellness
