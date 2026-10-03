import { Fragment, useEffect } from "react";
import { movements, welcomeImages } from "./data/movements";
import { mountExperience } from "./experience";

export default function App() {
  useEffect(() => mountExperience(), []);

  return (
    <>
      <div className="loader" data-loader="container">
        <div className="loader-progress" data-loader="progress">
          <span
            className="loader-progress-number"
            data-loader="progress-number"
          >
            000
          </span>
          <span>%</span>
        </div>
      </div>

      <canvas
        id="canvas"
        className="canvas"
        data-webgl="canvas"
        aria-hidden="true"
      />

      <main
        id="scroll-wrapper"
        className="scroll-wrapper"
        data-scroll="wrapper"
      >
        <div className="scroll-content" id="scroll-content">
          <div className="container">
            <section className="welcome" data-welcome="container">
              <div className="welcome-wrapper">
                <h1 className="welcome-title" data-welcome="title">
                  Herbert
                  <br />
                  Ntim
                </h1>
                <p className="welcome-description" data-welcome="description">
                  MPhil. Computer Engineering · Software Engineering · Kumasi, Ghana
                </p>
                <div
                  className="welcome-images"
                  data-welcome="image-container"
                  data-state="initial-out"
                >
                  {welcomeImages.map((image, index) => (
                    <img
                      key={image.src}
                      src={image.src}
                      alt=""
                      data-webgl="image"
                      data-type="welcome"
                      data-index={index}
                      width={image.width}
                      height={image.height}
                    />
                  ))}
                </div>
              </div>
              <div
                className="welcome-scroll"
                data-welcome="scroll-indicator"
                data-state="initial"
              >
                <svg
                  className="arrow"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 607 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M606.707 8.70705C607.098 8.31653 607.098 7.68336 606.707 7.29284L600.343 0.92888C599.953 0.538355 599.319 0.538356 598.929 0.92888C598.538 1.3194 598.538 1.95257 598.929 2.34309L604.586 7.99995L598.929 13.6568C598.538 14.0473 598.538 14.6805 598.929 15.071C599.319 15.4615 599.953 15.4615 600.343 15.071L606.707 8.70705ZM8.74228e-08 9L606 8.99995L606 6.99995L-8.74228e-08 7L8.74228e-08 9Z"
                    fill="currentColor"
                  />
                </svg>
                <div>SCROLL</div>
              </div>
            </section>

            <section className="intro" data-intro="container">
              <h4 className="intro-title">Intro</h4>
              <p className="intro-description" data-intro="description">
                Over centuries, <span className="medium">graphic design </span>
                has helped us to create{" "}
                <span className="medium">visual narratives</span> that impact
                the way <span className="medium">human communicate</span> with
                each other. Here are the most{" "}
                <span className="medium">impactful movements</span> that defined
                its <span className="medium">evolution</span>.
              </p>
            </section>

            <section className="slider" id="slider" data-slider="container">
              {movements.map((movement, index) => (
                <Fragment key={movement.slug}>
                  <div
                    className="slide-line"
                    data-slider="line"
                    data-state="hide"
                  />
                  <div
                    className="slide"
                    id={movement.slug}
                    data-slide="container"
                  >
                    <div
                      className="slide-title-wrapper"
                      data-slide="title-wrapper"
                    >
                      <h2 className="slide-title" data-slide="text">
                        {movement.name}
                      </h2>
                    </div>
                    <div className="slide-content">
                      <div className="slide-date">
                        <div className="slide-date--start" data-slide="text">
                          {movement.dateBegin}
                        </div>
                        <div className="slide-date--end" data-slide="text">
                          {movement.dateEnd}&nbsp;/
                        </div>
                      </div>
                      <button
                        className="slide-image-container"
                        data-slide="image-container"
                        aria-label={`Open ${movement.name} details`}
                        type="button"
                      >
                        <img
                          src={movement.thumbnail}
                          alt={`${movement.name} period illustration`}
                          data-slide="image"
                          data-webgl="image"
                          data-type="slide"
                          data-index={index}
                          width={movement.width}
                          height={movement.height}
                          className="slide-image"
                        />
                      </button>
                    </div>
                  </div>
                </Fragment>
              ))}
              <nav
                id="navigation"
                data-nav="container"
                data-state="hide"
                aria-label="Timeline navigation"
              >
                <div className="nav-progress-container">
                  <div className="nav-progress-mask" data-nav="progress-mask" />
                  <div
                    className="nav-progress-state"
                    data-nav="progress-state"
                  />
                </div>
                <div className="nav-wrapper">
                  {movements.map((movement) => (
                    <button
                      key={movement.slug}
                      className="nav-button"
                      data-nav="button"
                      data-target={movement.slug}
                      type="button"
                    >
                      <div className="clickable">
                        <span className="link-name">{movement.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </nav>
            </section>

            <div className="slide placeholder" data-slide="placeholder" />
            <div className="about-placeholder" />
          </div>
        </div>
      </main>

      <section
        id="scroll-fixed-wrapper"
        className="scroll-fixed-wrapper"
        data-scroll-fixed="wrapper"
        data-state="hide"
        aria-label="Fixed detail panel"
      >
        <div
          className="slide-detail-container"
          id="slide-detail-container"
          data-slide-detail="container"
          data-state="hide"
        >
          <button
            className="close-wrapper"
            data-slide-detail="close"
            aria-label="Close detail panel"
            type="button"
          >
            <svg
              width="30"
              viewBox="0 0 51 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="25.5" cy="25.5" r="25" stroke="currentColor" />
              <path
                d="M18.4663 32.3586L17.6406 31.5329L24.174 24.9996L17.6406 18.4663L18.4663 17.6406L24.9996 24.174L31.5329 17.6406L32.3586 18.4663L25.8253 24.9996L32.3586 31.5329L31.5329 32.3586L24.9996 25.8253L18.4663 32.3586Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="slide-detail" id="slide-detail">
            <div className="slide-detail-texts">
              <div className="slide-detail-texts-top">
                <div className="date" data-slide-detail="date">
                  <span className="date-start" data-slide-detail="date-start" />
                  <span>—</span>
                  <span className="date-end" data-slide-detail="date-end" />
                </div>
                <h1 className="title" data-slide-detail="title" />
                <div
                  className="slide-detail-separator"
                  data-slide-detail="separator"
                  data-state="hide"
                />
              </div>
              <div
                className="slide-detail-texts-bottom"
                data-slide-detail="text"
              >
                <div className="description" data-slide-detail="description" />
                <div className="slide-detail-texts-split">
                  <div className="context" data-slide-detail="context-wrapper">
                    <div className="slide-detail-subtitle">
                      Historical Context
                    </div>
                    <div data-slide-detail="context" />
                  </div>
                  <div
                    className="slide-detail-line"
                    data-slide-detail="line"
                    data-state="hide"
                  />
                  <div
                    className="influences"
                    data-slide-detail="influences-wrapper"
                  >
                    <div className="slide-detail-subtitle">Key Influences</div>
                    <div data-slide-detail="influences" />
                  </div>
                </div>
              </div>
            </div>
            <div className="slide-detail-images" data-slide-detail="image" />
          </div>
        </div>
      </section>

      <section className="about" data-about="container">
        <div className="about-wrapper">
          <h2 className="about-title">
            Thanks for
            <br /> visiting
          </h2>
          <div className="about-content">
            <div className="about-thank">
              <h4>Graphic Design History</h4>
              <div className="line-horizontal" />
              <div>
                This website is dedicated to the history of graphic design. We
                aim to educate and inspire through comprehensive insights and
                visual examples.
              </div>
            </div>
            <div className="about-credits">
              <h4>Built with passion by</h4>
              <div className="line-horizontal" />
              <div className="about-credits-list">
                <div>
                  <h5>Design:</h5>
                  <a href="https://www.florencejeev.com/">Florence Jeev</a>
                </div>
                <div>
                  <h5>Development:</h5>
                  <a href="https://www.moussamamadou.com">Moussa MAMADOU</a>
                </div>
              </div>
            </div>
            <div className="about-references">
              <h4>Book & Articles References</h4>
              <div className="line-horizontal" />
              <div className="about-references-list">
                <a href="https://www.onlinedesignteacher.com/2016/05/graphic-design-styles.html">
                  Graphic Design Styles - Online Design Teacher (Article)
                </a>
                <a href="https://www.amazon.fr/Design-Definitive-Visual-History-DK-dp-0241631785/dp/0241631785/">
                  DK - Design: The Definitive Visual History (Book)
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="sr-only">
          Chapman Test Extended font made from Online Web Fonts and licensed by
          CC BY 4.0.
        </p>
      </section>
    </>
  );
}
