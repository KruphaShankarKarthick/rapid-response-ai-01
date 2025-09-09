# 🚨 Smart SOS Device for Mass Gatherings

## 📌 Problem Statement
Imagine yourself at **Simhastha** — millions of people around, crowded streets, loud chants.  
Suddenly, someone next to you collapses. You try to call for help… but the **mobile network is dead**. No calls, no data, nothing.

This is the reality of mass gatherings:
- Networks crash under heavy use.  
- People can’t connect to police, medical, or fire services.  
- Even if alerts are raised, false triggers waste valuable time.  

👉 What’s missing is a **simple, reliable way to send an SOS with exact location — without depending on the Internet.**


## 💡 Proposed Solution
We built a **tiny SOS device** that anyone can carry.

- Powered by **ESP32**, **Neo-6M GPS**, and **SIM800 GSM** module.  
- Press and hold the **SOS button for 5 seconds** → device grabs GPS coordinates and sends an **SMS alert** directly to the control room.  
- **No apps. No Internet. Just one press → instant help request.**

At the control room:
- An **offline dashboard** displays the alert.  
- The map shows **exact location + emergency type**.  
- Teams can be **assigned instantly** — police, fire, or medical. 

 ## 🛠️ Prototype Demo

**Device:**  
- Small ESP32 board with GPS + GSM + SOS button.  

**Sample SMS Alert:**

SOS ID: V123 MEDICAL
Lat: 23.24 Lon: 77.41
Time: 18:32 Battery: 82%


**Dashboard:**  
- List of all incoming SOS alerts.  
- Map with **red pins** showing emergency spots.  
- Buttons to **assign teams and track status**.  



## ⚙️ Technology Stack

### 🔩 Hardware
- **ESP32** → brain of the device  
- **Neo-6M GPS** → pinpoints location  
- **SIM800 GSM** → sends SMS alerts  
- **SOS button + rechargeable battery**

### 💻 Software
- **Node.js** server running locally in the control room  
- **React.js** dashboard with offline OpenStreetMap  
- Communication via **plain SMS** → works even without Internet  



## 🌍 Impact & Use Cases

### Beneficiaries
- **Pilgrims & citizens** → especially elderly or kids without smartphones  
- **Volunteers** → report incidents instantly  
- **Police, fire, medical teams** → get exact GPS locations  
- **Event organizers** → monitor everything in one dashboard  

### Key Impact
- Saves lives by reducing response time  
- Works even when mobile data fails  
- Low-cost, scalable safety net for any gathering  


## 🚀 Future Scope
- Next-gen modules like **SIM868/SIM7600** (GPS + GSM combined)  
- **AI prediction** for high-risk zones  
- **Backup mesh networks** for SMS failover  
- **Wearable SOS wristbands** for elderly pilgrims  
- **Government dashboard integration** for direct coordination  


## ✅ Conclusion
Why does our prototype stand out?
- ❌ No Internet, no apps required — it just works.  
- ✅ Uses SMS, which works even when networks are jammed.  
- ✅ Affordable and scalable — thousands can be deployed at low cost.  
- ✅ Built for real-world **chaos like Kumbh Mela**.  

👉 In short: **One simple button. Smart tech inside. Life-saving response outside.**


