## Getting Started

First, open the attached colab notebook to run the backend server, you would need to create Ngrok account to get a static url to host your backend via Colab:
<img width="1088" height="354" alt="image" src="https://github.com/user-attachments/assets/c948be17-e2c4-48bc-b189-2b10f48abc54" />

Once you have a static domain, create a .env file in the root folder and paste this line:
```
backend_server_url=YOUR_STATIC_DOMAIN
```
Replace 'YOUR_STATIC_DOMAIN' with your actual domain.

For Clerk to work you would need to create an account at: https://clerk.com/ and get the authentication keys.
Also add these lines in the .env:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_client_public_key
CLERK_SECRET_KEY=your_client_secret
```
You need to put your own keys here (its free!).

Second, install the dependencies:
```bash
npm install
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: You need to keep the colab notebook running, that is your backend server.

Now, you should see the landing page and start inpainting.
<img width="1777" height="886" alt="image" src="https://github.com/user-attachments/assets/ec3154b3-0415-4b97-839c-86b00afb566b" />

