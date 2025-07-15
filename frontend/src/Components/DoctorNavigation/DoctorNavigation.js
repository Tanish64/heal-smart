// src/Components/DoctorNavigation/DoctorNavigation.js

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { doctorMenuItems } from '../../utils/doctorMenuItems';
import avatar from '../../img/avatar.png';
import { Link, useLocation } from 'react-router-dom';

function DoctorNavigation({ active, setActive }) {
  const location = useLocation();

  useEffect(() => {
    const currentItem = doctorMenuItems.find(item => item.link === location.pathname);
    if (currentItem && setActive) {
      setActive(currentItem.id);
    }
  }, [location.pathname, setActive]);

  return (
    <NavStyled>
      <div className="user-con">
        <Link to="/doctordashboard" className="logo">
          <img src={avatar} alt="HealSmart Doctor" />
          <h2>Doctor Panel</h2>
        </Link>
      </div>
      <ul className="menu-items">
        {doctorMenuItems.map((item) => (
          <li key={item.id} tabIndex={0}>
            <Link
              to={item.link}
              onClick={() => active !== item.id && setActive && setActive(item.id)}
              className={active === item.id ? 'active' : ''}
              aria-current={active === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 2rem;
  width: 450px;
  height: 100%;
  background: rgba(245, 236, 248, 0.78);
  border: 3px solid rgb(235, 211, 243);
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;

  .user-con {
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    .logo {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      text-decoration: none;

      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        object-fit: cover;
        background: #fcf6f9;
        border: 2px solid #6B46C1;
        padding: 0.2rem;
      }

      h2 {
        color: rgb(74, 36, 165);
        font-weight: 900;
        font-size: 2.5rem;
        white-space: nowrap;
      }
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;

    li {
      list-style: none;
      margin: 0.8rem 0;
      outline: none;
    }

    a {
      display: grid;
      grid-template-columns: 40px auto;
      align-items: center;
      font-weight: 700;
      font-size: 1.5rem;
      cursor: pointer;
      color: rgba(11, 11, 61, 0.6);
      padding-left: 1rem;
      text-decoration: none;
      position: relative;
      transition: all 0.4s ease-in-out;

      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 1.5rem;
        transition: all 0.4s ease-in-out;
      }

      &:hover {
        color: rgba(34, 34, 96, 0.8);
        i {
          color: rgba(34, 34, 96, 0.8);
        }
      }
    }

    a.active {
      color: rgba(34, 34, 96, 1);
      font-weight: 900;

      i {
        color: rgba(34, 34, 96, 1);
      }

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: #222260;
        border-radius: 0 10px 10px 0;
      }
    }
  }

  @media (max-width: 768px) {
    width: 300px;
    padding: 1rem;
  }
`;

export default DoctorNavigation;
