import React from "react";
import "./Authpage.css";
import { motion } from "framer-motion";
import { Button } from "./Button";

import { ChevronLeftIcon, Salad } from "lucide-react";
import { Input } from "./input";
import {cn} from "../../lib/utils";

export function AuthPage() {
  return (
    <main className="main">
      <div className="leftPanel">
        <div className="gradientOverlay" />
        <div className="brandRow">
          <Salad className="brandIcon" />
          <p className="brandText">Fitmate</p>
        </div>
        <div className="quoteBlock">
          <blockquote>
            <p className="quoteText">
              &ldquo;Understand your body better.
      Track nutrition, movement, and progress — all in one place.&rdquo;
            </p>
            <footer className="quoteFooter">~ Fitmate</footer>
          </blockquote>
        </div>
        <div className="pathsContainer">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="rightPanel">
        <Button variant="ghost" className="homeBtn" asChild>
          <a href="#">
            <ChevronLeftIcon className="homeIcon" />
            Home
          </a>
        </Button>
        <div className="container">
          {/* <div className="brandRowMobile">
            <Salad className="brandIcon" />
            <p className="brandText">Fitmate</p>
          </div> */}
          <div className="flex flex-col space-y-1">
            <h1 className="title">
              Sign In or Join Now!
            </h1>
            <p className="subtitle">
              login or create your Fitmate account.
            </p>
          </div>
          <div className="space-y-2 mb-3">
            <Button type="button" size="lg" className="btnBlack">
              <GoogleIcon className="homeIcon" color="white"/>
              <span>Continue with Google</span>
            </Button>
          </div>
          
          <div className="mb-3">
            <AuthSeparator />
          </div>

          <form>
            <p className="formText">
              Enter your email address to sign in or create an account
            </p>
            <div className="inputGroup">
              <div style={{ paddingBottom: "0.5rem" }}>
                <Input
                  placeholder="your.email@example.com"
                  className=""
                  type="email"
                />
              </div>
              <Input
                placeholder="your password"
                className=""
                type="password"
              />
            </div>

            <Button type="button" className="btnBlack">
              <span>Continue With Email</span>
            </Button>
          </form>
          <p className="terms">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="link"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="link"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.6 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="svgFull"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#492110"
            strokeWidth={path.width}
            strokeOpacity={0.2 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.7 }}
            animate={{
              pathLength: 1,
              opacity: [0.4, 0.7, 0.4],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
const GoogleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

const AuthSeparator = () => {
  return (
    <div className="separator">
      <div className="sepLine" />
      <span className="sepText">OR</span>
      <div className="sepLine" />
    </div>
  );
};
