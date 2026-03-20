import Image from "next/image";

import { PHOTO_GRID } from "@/components/home/data";
import styles from "@/components/home/home-page.module.css";

export function PhotoGridSection() {
  return (
    <section className={styles.photoGrid}>
      {PHOTO_GRID.map((photo) => (
        <div
          key={photo.label}
          className={[styles.photoCell, photo.large ? styles.photoLarge : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className={styles.photoImage}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className={styles.photoOverlay}>
            <span className={styles.photoLabel}>{photo.label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
