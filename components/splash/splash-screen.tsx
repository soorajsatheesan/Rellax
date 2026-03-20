import styles from "./splash.module.css";

type SplashScreenProps = {
  isFading: boolean;
};

/** Pure presentational component — owns no state or timing logic. */
export function SplashScreen({ isFading }: SplashScreenProps) {
  const overlayClass = [styles.overlay, isFading ? styles.overlayFading : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={overlayClass} aria-hidden="true">
      <div className={styles.content}>
        <span className={["font-display", styles.logo].join(" ")}>Rellax</span>
        <div className={styles.loaderTrack}>
          <div className={styles.loaderBar} />
        </div>
      </div>
    </div>
  );
}
