"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import StatusBar from "@/components/StatusBar";

function SignUpContent() {
  // We need router and signUp but don't use them directly
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [coupleNameTouched, setCoupleNameTouched] = useState(false);
  const [partner1NameTouched, setPartner1NameTouched] = useState(false);
  const [partner2NameTouched, setPartner2NameTouched] = useState(false);
  const [interestsTouched, setInterestsTouched] = useState(false);

  // Final step state
  const [signupComplete, setSignupComplete] = useState(false);

  const availableInterests = [
    { id: "hikes", name: "Hikes", icon: "👟" },
    { id: "coffee", name: "Coffee", icon: "☕" },
    { id: "brunch", name: "Brunch", icon: "🍳" },
    { id: "games", name: "Games", icon: "🎲" },
    { id: "movies", name: "Movies", icon: "🎬" },
    { id: "travel", name: "Travel", icon: "✈️" },
    { id: "cooking", name: "Cooking", icon: "👨‍🍳" },
    { id: "fitness", name: "Fitness", icon: "💪" },
  ];

  // Email validation
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const toggleInterest = (interest: string) => {
    setInterestsTouched(true);
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleNextStep = () => {
    // Mark all fields as touched for the current step
    if (step === 1) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setCoupleNameTouched(true);

      if (!email || !password || !coupleName) {
        setError("Please fill out all fields");
        return;
      }
      if (!isEmailValid(email)) {
        setError("Please enter a valid email address");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    if (step === 2) {
      setPartner1NameTouched(true);
      setPartner2NameTouched(true);

      if (!partner1Name || !partner2Name) {
        setError("Please enter both partner names");
        return;
      }
    }

    if (step === 3) {
      setInterestsTouched(true);

      if (interests.length < 1) {
        setError("Please select at least one interest");
        return;
      }
    }

    setError(null);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simplified signup - no actual API calls
      await signUp(email, password);

      // Just show the success screen
      setSignupComplete(true);
    } catch (error: unknown) {
      console.error("Error during sign up:", error);
      setError(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const isCurrentStepValid = () => {
    if (step === 1) {
      return (
        email &&
        isEmailValid(email) &&
        password &&
        password.length >= 6 &&
        coupleName
      );
    }
    if (step === 2) {
      return partner1Name && partner2Name;
    }
    if (step === 3) {
      return interests.length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    if (signupComplete) {
      return (
        <div className="signup-success">
          <h2 className="success-title">You&apos;re all set!</h2>
          <p className="success-message">
            Your account has been created successfully.
          </p>
          <button
            className="btn btn-connect"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="signup-step">
            <h2 className="step-title">Basic Info</h2>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`form-input ${
                  emailTouched && (!email || !isEmailValid(email))
                    ? "input-error"
                    : ""
                }`}
                placeholder="Enter your email"
                required
              />
              {emailTouched && !email && (
                <p className="validation-message">Email is required</p>
              )}
              {emailTouched && email && !isEmailValid(email) && (
                <p className="validation-message">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`form-input ${
                  passwordTouched && (!password || password.length < 6)
                    ? "input-error"
                    : ""
                }`}
                placeholder="Create a password"
                required
              />
              <p className="input-help">At least 6 characters</p>
              {passwordTouched && !password && (
                <p className="validation-message">Password is required</p>
              )}
              {passwordTouched && password && password.length < 6 && (
                <p className="validation-message">
                  Password must be at least 6 characters
                </p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="coupleName">Couple Name</label>
              <input
                type="text"
                id="coupleName"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                onBlur={() => setCoupleNameTouched(true)}
                className={`form-input ${
                  coupleNameTouched && !coupleName ? "input-error" : ""
                }`}
                placeholder="How you want to be known"
                required
              />
              <p className="input-help">This will be visible to other users</p>
              {coupleNameTouched && !coupleName && (
                <p className="validation-message">Couple name is required</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="signup-step">
            <h2 className="step-title">Partner Names</h2>
            <div className="form-group">
              <label htmlFor="partner1Name">Partner 1 Name</label>
              <input
                type="text"
                id="partner1Name"
                value={partner1Name}
                onChange={(e) => setPartner1Name(e.target.value)}
                onBlur={() => setPartner1NameTouched(true)}
                className={`form-input ${
                  partner1NameTouched && !partner1Name ? "input-error" : ""
                }`}
                placeholder="Enter first partner's name"
                required
              />
              {partner1NameTouched && !partner1Name && (
                <p className="validation-message">Partner 1 name is required</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="partner2Name">Partner 2 Name</label>
              <input
                type="text"
                id="partner2Name"
                value={partner2Name}
                onChange={(e) => setPartner2Name(e.target.value)}
                onBlur={() => setPartner2NameTouched(true)}
                className={`form-input ${
                  partner2NameTouched && !partner2Name ? "input-error" : ""
                }`}
                placeholder="Enter second partner's name"
                required
              />
              {partner2NameTouched && !partner2Name && (
                <p className="validation-message">Partner 2 name is required</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="bio">Couple Bio (Optional)</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="form-textarea"
                placeholder="Tell others a bit about yourselves"
                rows={3}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="signup-step">
            <h2 className="step-title">Your Interests</h2>
            <p className="step-description">
              Select activities you enjoy doing together
            </p>
            <div className="interests-grid">
              {availableInterests.map((interest) => (
                <div
                  key={interest.id}
                  className={`interest-item ${
                    interests.includes(interest.id) ? "selected" : ""
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <span className="interest-icon">{interest.icon}</span>
                  <span className="interest-name">{interest.name}</span>
                </div>
              ))}
            </div>
            {interestsTouched && interests.length === 0 && (
              <p className="validation-message">
                Please select at least one interest
              </p>
            )}
          </div>
        );
      case 4:
        return (
          <div className="signup-step">
            <h2 className="step-title">Ready to Connect?</h2>
            <p className="step-description">
              You&apos;re all set to start connecting with other couples!
            </p>
            <div className="profile-preview">
              <h3>{coupleName}</h3>
              <p>
                {partner1Name} & {partner2Name}
              </p>
              {bio && <p className="preview-bio">{bio}</p>}
              <div className="preview-interests">
                {interests.map((id) => (
                  <span key={id} className="interest-tag">
                    {availableInterests.find((i) => i.id === id)?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="phone-container">
        <StatusBar />
        <div className="main-content">
          <main className="content-wrapper">
            <div className="header">
              <Link href="/" className="back-link">
                ← Home
              </Link>
            </div>

            <div className="auth-logo-container">
              <div className="logo-container">
                <Image
                  src="/pairsy-icon.png"
                  alt="Pairsy"
                  width={60}
                  height={60}
                  className="auth-logo"
                />
                <h1 className="app-title">Sign Up</h1>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="signup-form">
              {/* Step indicator */}
              {!signupComplete && (
                <div className="step-indicator">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      className={`step-dot ${step >= num ? "active" : ""}`}
                    ></div>
                  ))}
                </div>
              )}

              {renderStepContent()}

              {!signupComplete && (
                <div className="form-buttons">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn btn-secondary"
                    >
                      Back
                    </button>
                  )}
                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn btn-connect"
                      disabled={!isCurrentStepValid() || loading}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-connect"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  )}
                </div>
              )}
            </form>

            {!signupComplete && step === 1 && (
              <div className="auth-footer">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="text-link">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for future compatibility
export default function SignUp() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
