# Code Diary
### 1/3/23
- 1 hour made server id data global
- 30 mins fixed wrong channel loading

### 1/2/23
- 1 hour smoother server/channel loading

### 12/22/22
- 1 hour channel content loading

### 12/20/22
- 1 hour routing
- 1.5 hour data loading
- 30 mins home page
- 1 hour generating random data
- 1 hour displaying fetched data

### 12/18/22 
- 30 mins routing

### 12/16/22
- 1 hour scrollbar
- 2 hours tooltips follow sidebar
- 3.5 hours resize textarea and chatbar
- 1 hour chat post cards

### 12/15/22
- 3 hours mobile responsiveness

### 12/14/22
- 1 hour planning
- 1 hour setting up tailwind
- 30 mins sidebar icons
- 30 mins sidebar tooltip
- 30 mins content pane
- 3 hours right sidebar
- 2 hours deploying static page to digitalocean
- 1.5 hours frontend inner sidebar & chatbar

#### Plan
Create frontend for chat app (Discord clone)
- Login/Signup
- Authenticated
    - Sidebar
        - Buttons for DMs, servers, create server, explore public servers
    - Pages
        - DMs
            - Inner left sidebar - name of people who sent DMs
            - Content
                - All friends
                - DMs
        - Server
            - Public or private
            - Inner left sidebar
                - If admin/mod
                    - Invite people
                - If admin
                    - Delete server
                - Channels
            - Inner right sidebar - users in server
                - Separators
                    - Admin, Mod, User, Banned
                - Click on user
                    - Tooltip
                        - Send friend request
                        - Message person
                        - View profile
            - Content
                - Per channel
                    - Messages
                        - Click on user who sent message
                            - Tooltip (see above)
                    - Message box to send message
        - Create server
            - Name of server
            - Description
            - Public or private
            - Upload icon image for server
            - Upload cover photo for server
        - Explore servers
            - Content
                - Header - search servers
                - Communities as cards (filtered by search)
                    - Cover photo, icon, title, description, users online, total members
