<template>
  <div class="chat-page">
    <!-- Header -->
    <div class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <div class="logo-icon-small">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2V4C2 2.89 2.89 2 4 2H6V4H4V6M20 2H22V4H20V6H22V8H20V10H18V8H16V6H18V4H16V2H18V0H20V2M4 20H2V22C2 23.11 2.89 24 4 24H6V22H4V20M22 22V20H20V18H22V16H20V14H18V16H16V18H18V20H16V22H18V24H20V22H22Z"/>
              </svg>
            </div>
            <div class="nav-tabs">
              <router-link to="/panel-tutor" class="nav-tab">Panel</router-link>
              <router-link to="/home" class="nav-tab">Cursos</router-link>
              <div class="nav-tab active">Chats</div>
              <router-link to="/explorar" class="nav-tab">Explorar</router-link>
            </div>
          </div>
          <div class="header-right">
            <button v-if="isTutor" class="calendar-btn" @click="openCalendar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z"/>
              </svg>
            </button>
            <div class="user-icon" @click="handleProfile">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="chat-container">
        <!-- Left Panel - Chat List -->
        <div class="chat-list">
          <div class="search-bar">
            <input 
              type="text" 
              placeholder="Nombre a buscar" 
              v-model="searchQuery"
              @input="filterChats"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-btn">×</button>
          </div>
          
          <div class="chat-items">
            <div 
              v-for="chat in filteredChats" 
              :key="chat.id"
              :class="['chat-item', { active: selectedChat?.id === chat.id }]"
              @click="selectChat(chat)"
            >
              <div class="chat-avatar">
                <img :src="chat.avatar" :alt="chat.name" />
              </div>
              <div class="chat-info">
                <div class="chat-name">{{ chat.name }}</div>
                <div class="chat-last-message">{{ chat.lastMessage }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Chat Messages -->
        <div class="chat-messages">
          <div v-if="selectedChat" class="chat-header">
            <div class="chat-user-info">
              <div class="chat-avatar">
                <img :src="selectedChat.avatar" :alt="selectedChat.name" />
              </div>
              <div class="chat-details">
                <div class="chat-name">{{ selectedChat.name }}</div>
                <div class="chat-course">{{ selectedChat.course }}</div>
              </div>
            </div>
          </div>

          <div class="messages-container">
            <div 
              v-for="message in messages" 
              :key="message.id"
              :class="['message', { 'own-message': message.isOwn }]"
            >
              <div class="message-bubble">
                {{ message.text }}
              </div>
            </div>
          </div>

          <div class="message-input">
            <input 
              type="text" 
              placeholder="Value" 
              v-model="newMessage"
              @keypress.enter="sendMessage"
            />
            <button @click="sendMessage" class="send-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10L17 12 2 14 2.01 21Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Modal -->
    <div v-if="showCalendar" class="calendar-modal" @click="closeCalendar">
      <div class="calendar-content" @click.stop>
        <div class="calendar-header">
          <h3>Reservar curso</h3>
          <button @click="closeCalendar" class="close-btn">×</button>
        </div>
        
        <div class="calendar-widget">
          <div class="month-selector">
            <button @click="previousMonth" class="nav-btn">‹</button>
            <div class="month-display">{{ currentMonth }}</div>
            <button @click="nextMonth" class="nav-btn">›</button>
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-header-days">
              <div class="day-header">SUN</div>
              <div class="day-header">MON</div>
              <div class="day-header">TUE</div>
              <div class="day-header">WED</div>
              <div class="day-header">THU</div>
              <div class="day-header">FRI</div>
              <div class="day-header">SAT</div>
            </div>
            
            <div class="calendar-days">
              <div 
                v-for="day in calendarDays" 
                :key="day"
                :class="['calendar-day', { 
                  selected: selectedDate === day,
                  highlighted: reservedDates.includes(day)
                }]"
                @click="selectDate(day)"
              >
                {{ day }}
              </div>
            </div>
          </div>
          
          <div class="calendar-actions">
            <button @click="reserveDate" class="reserve-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
              </svg>
              Reservar
            </button>
            <button @click="closeCalendar" class="cancel-btn">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Chat',
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const selectedChat = ref(null)
    const newMessage = ref('')
    const showCalendar = ref(false)
    const selectedDate = ref(null)
    const currentMonth = ref('June 2023')
    const reservedDates = ref([5, 21]) // Fechas ya reservadas
    
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const isTutor = computed(() => user.rol === 'docente')

    const chats = ref([
      {
        id: 1,
        name: 'Nombre',
        lastMessage: 'Ultimo mensaje',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        course: 'Curso 001'
      },
      {
        id: 2,
        name: 'María García',
        lastMessage: 'Hola, me interesa reservar una clase',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        course: 'Matemáticas Básicas'
      },
      {
        id: 3,
        name: 'Carlos López',
        lastMessage: '¿Podríamos coordinar un horario?',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        course: 'Programación Web'
      }
    ])

    const messages = ref([
      {
        id: 1,
        text: 'Hola, me interesa reservar una clase de matemáticas',
        isOwn: false
      },
      {
        id: 2,
        text: 'Perfecto, ¿qué horario te conviene?',
        isOwn: true
      },
      {
        id: 3,
        text: 'Podría ser los martes por la tarde',
        isOwn: false
      },
      {
        id: 4,
        text: 'Excelente, te confirmo el horario',
        isOwn: true
      },
      {
        id: 5,
        text: 'Gracias por la confirmación',
        isOwn: false
      }
    ])

    const calendarDays = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30])

    const filteredChats = computed(() => {
      if (!searchQuery.value) return chats.value
      return chats.value.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const selectChat = (chat) => {
      selectedChat.value = chat
    }

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        messages.value.push({
          id: messages.value.length + 1,
          text: newMessage.value,
          isOwn: true
        })
        newMessage.value = ''
      }
    }

    const filterChats = () => {
      // La lógica de filtrado se maneja en el computed
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const openCalendar = () => {
      showCalendar.value = true
    }

    const closeCalendar = () => {
      showCalendar.value = false
      selectedDate.value = null
    }

    const selectDate = (day) => {
      selectedDate.value = day
    }

    const reserveDate = () => {
      if (selectedDate.value) {
        reservedDates.value.push(selectedDate.value)
        alert(`Fecha ${selectedDate.value} reservada exitosamente`)
        closeCalendar()
      }
    }

    const previousMonth = () => {
      // Lógica para cambiar al mes anterior
      console.log('Previous month')
    }

    const nextMonth = () => {
      // Lógica para cambiar al mes siguiente
      console.log('Next month')
    }

    const handleProfile = () => {
      if (isTutor.value) {
        router.push('/perfil-tutor')
      } else {
        router.push('/perfil')
      }
    }

    onMounted(() => {
      // Seleccionar el primer chat por defecto
      if (chats.value.length > 0) {
        selectedChat.value = chats.value[0]
      }
    })

    return {
      searchQuery,
      selectedChat,
      newMessage,
      showCalendar,
      selectedDate,
      currentMonth,
      reservedDates,
      calendarDays,
      isTutor,
      chats,
      messages,
      filteredChats,
      selectChat,
      sendMessage,
      filterChats,
      clearSearch,
      openCalendar,
      closeCalendar,
      selectDate,
      reserveDate,
      previousMonth,
      nextMonth,
      handleProfile
    }
  }
}
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 15px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-icon-small {
  width: 30px;
  height: 30px;
  background-color: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon-small svg {
  width: 20px;
  height: 20px;
  color: #2c3e50;
}

.nav-tabs {
  display: flex;
  gap: 20px;
}

.nav-tab {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-tab.active {
  background-color: #36759e;
}

.nav-tab:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.calendar-btn {
  background-color: #36759e;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.calendar-btn:hover {
  background-color: #2c5aa0;
}

.calendar-btn svg {
  width: 20px;
  height: 20px;
}

.user-icon {
  width: 35px;
  height: 35px;
  background-color: #ecf0f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-icon svg {
  width: 20px;
  height: 20px;
  color: #2c3e50;
}

.main-content {
  height: calc(100vh - 70px);
}

.chat-container {
  display: flex;
  height: 100%;
}

.chat-list {
  width: 30%;
  background-color: #f8f9fa;
  border-right: 1px solid #ecf0f1;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 20px;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 12px 40px 12px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background-color: #90c0d8;
  color: #2c3e50;
  font-size: 14px;
}

.search-bar input::placeholder {
  color: #7f8c8d;
}

.clear-btn {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 18px;
}

.chat-items {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #ecf0f1;
}

.chat-item:hover {
  background-color: #e8f4f8;
}

.chat-item.active {
  background-color: #90c0d8;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.chat-last-message {
  color: #7f8c8d;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.chat-header {
  background-color: #2c3e50;
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.chat-details .chat-name {
  color: white;
  font-weight: 500;
  margin-bottom: 2px;
}

.chat-course {
  color: #bdc3c7;
  font-size: 14px;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
}

.message.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background-color: #ecf0f1;
  color: #2c3e50;
  word-wrap: break-word;
}

.message.own-message .message-bubble {
  background-color: #36759e;
  color: white;
}

.message-input {
  padding: 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #ecf0f1;
}

.message-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
}

.send-btn {
  background-color: #36759e;
  border: none;
  color: white;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.send-btn:hover {
  background-color: #2c5aa0;
}

.send-btn svg {
  width: 20px;
  height: 20px;
}

.calendar-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.calendar-content {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  width: 90%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.nav-btn {
  background-color: #90c0d8;
  border: none;
  color: #2c3e50;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.month-display {
  background-color: #90c0d8;
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
}

.calendar-grid {
  margin-bottom: 20px;
}

.calendar-header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.day-header {
  text-align: center;
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.calendar-day:hover {
  background-color: #ecf0f1;
}

.calendar-day.selected {
  background-color: #36759e;
  color: white;
}

.calendar-day.highlighted {
  background-color: #90c0d8;
  color: #2c3e50;
}

.calendar-actions {
  display: flex;
  gap: 10px;
}

.reserve-btn {
  flex: 1;
  background-color: #90c0d8;
  color: #2c3e50;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
}

.reserve-btn:hover {
  background-color: #7bb3d1;
}

.cancel-btn {
  flex: 1;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: #34495e;
}

@media (max-width: 768px) {
  .chat-list {
    width: 100%;
  }
  
  .chat-messages {
    display: none;
  }
  
  .nav-tabs {
    display: none;
  }
  
  .calendar-content {
    width: 95%;
  }
}
</style>
