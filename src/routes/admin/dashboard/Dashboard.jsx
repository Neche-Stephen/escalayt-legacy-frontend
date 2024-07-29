import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import folderImg from '../../../assets/images/folder.png';
import frameImg from '../../../assets/images/frame.png';
import engineImg from '../../../assets/images/engine.png';
import goodImg from '../../../assets/images/good.png';

import axios from 'axios';
import TicketTable from '../../../components/dashboard/ticketTable/TicketTable';

import { fetchTicketCount } from '../../../utils/dashboard-methods';



const Dashboard = () => {
    // State values for ticket count
    const [totalTicketCount, setTicketTotalCount] = useState(0);
    const [openTicketCount, setOpenTicketCount] = useState(0);
    const [resolvedTicketCount, setResolvedTicketCount] = useState(0);
    const [ongoingTicketCount, setOngoingTicketCount] = useState(0);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(0); 
  const [hasMore, setHasMore] = useState(true);


  const formatDate = (dateString) => { 
    const date = new Date(dateString);
    const today = new Date(); 
    const timeDiff = today - date; 
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); 
    
    if (daysDiff === 0) { 
      return 'Today'; 
    } else if(daysDiff === 1) { 
      return '1 day ago'; 
    } else { 
      return `${daysDiff} days ago`; 
    } 
  };


  // Fetch Tickets
  useEffect(() => { 

    const fetchTickets = async () => { 
      
      try { 

      // const token = localStorage.getItem('jwtToken'); 

      const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBRE1JTiJdLCJzdWIiOiJNdWdpZG8xIiwiaWF0IjoxNzIyMjcxMjg2LCJleHAiOjE3MjIzNTc2ODZ9.UFQyj8DhPYqtHovlE--gqkV2t7mkNtlIVOwSe_DpfyA";
     
      const response = await axios.get('http://localhost:8080/api/v1/ticket/view-all-tickets', {
         params: {page},
         headers: { 
          Authorization: `Bearer ${token}` 
         } 
        });

        const {data} = response;

        const formattedTickets = data.map(ticket => ({ 
          ...ticket,
          ticketNumber: ticket.id,
          assignee: ticket.assigneeFullName || 'Unassigned', 
          dateCreated: formatDate(ticket.createdAt) 
        })); 

        setTickets(formattedTickets); 

        setHasMore(fetchTickets.length > 0);

      } catch (error) { 
        console.error('Error fetching tickets:', error); 
      } 
    }; 

    fetchTickets(); 
  }, [page]);

  // Fetch Ticket Count
  useEffect(() => {
    // Method to ticket count
    fetchTicketCount(setTicketTotalCount, setOpenTicketCount, setResolvedTicketCount, setOngoingTicketCount);
  }, []);

  const handleButtonClick = (type) => {
    navigate(`/tickets/${type}`);
  };

  return (
    <div className={styles.dashboardContainer}>

      {/* Ticket Count Card */}
      <div className={styles.buttonGroup}>
        <div className={`${styles.dashboardButton} ${styles.totalTicketsButton}`} onClick={() => handleButtonClick('total')}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>Total Tickets</div>
            <img src={folderImg} alt="Total Tickets" className={styles.buttonImg} />
          </div>
          <div className={styles.ticketCount} style={{ color: '#0070FF' }}>{totalTicketCount}</div>
        </div>

        <div className={`${styles.dashboardButton} ${styles.openTicketsButton}`} onClick={() => handleButtonClick('open')}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>Open Tickets</div>
            <img src={frameImg} alt="Open Tickets" className={styles.buttonImg} />
          </div>
          <div className={styles.ticketCount} style={{ color: '#FF4C4C' }}>{openTicketCount}</div>
        </div>

        <div className={`${styles.dashboardButton} ${styles.inProgressTicketsButton}`} onClick={() => handleButtonClick('in-progress')}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>In-Progress Tickets</div>
            <img src={engineImg} alt="In-Progress Tickets" className={styles.buttonImg} />
          </div>
          <div className={styles.ticketCount} style={{ color: '#FFA500' }}>{ongoingTicketCount}</div>
        </div>

        <div className={`${styles.dashboardButton} ${styles.resolvedTicketsButton}`} onClick={() => handleButtonClick('resolved')}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>Resolved Tickets</div>
            <img src={goodImg} alt="Resolved Tickets" className={styles.buttonImg} />
          </div>
          <div className={styles.ticketCount} style={{ color: '#32CD32' }}>{resolvedTicketCount}</div>
        </div>
      </div>


      {/* Ticket Table */}

      <TicketTable tickets = {tickets} setTickets = {setTickets} setPage = {setPage} page={page} />



    </div>
  );
};

export default Dashboard;
