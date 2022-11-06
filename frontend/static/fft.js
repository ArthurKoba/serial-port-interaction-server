export function FFT (AVal) {
  let FTvl = []
  let TwoPi = 6.283185307179586;
  let Nvl = AVal.length
  let Nft = Nvl/2

  let i, j, n, m, Mmax, Istp;
  let Tmpr, Tmpi, Wtmp, Theta;
  let Wpr, Wpi, Wr, Wi;
  let Tmvl = []

  n = Nvl*2
  for (i = 0; i < n; i += 2) {
    Tmvl[i] = 0
    Tmvl[i+1] = AVal[i/2]
  }
  i = 1, j = 1
  while (i < n) {
    if (j > i) {
      Tmpr = Tmvl[i];
      Tmvl[i] = Tmvl[j];
      Tmvl[j] = Tmpr;
      Tmpr = Tmvl[i+1];
      Tmvl[i+1] = Tmvl[j+1]; Tmvl[j+1] = Tmpr;
    }
    i = i + 2; m = Nvl;
    while ((m >= 2) && (j > m)) {
      j = j - m; m = m >> 1;
    }
    j = j + m;
  }
  Mmax = 2;
  while (n > Mmax) {
    Theta = TwoPi / Mmax; Wpi = Math.sin(Theta);
    Wtmp = Math.sin(Theta / 2); Wpr = Wtmp * Wtmp * 2;
    Istp = Mmax * 2; Wr = 1; Wi = 0; m = 1;

    while (m < Mmax) {
      i = m; m = m + 2; Tmpr = Wr; Tmpi = Wi;
      Wr = Wr - Tmpr * Wpr - Tmpi * Wpi;
      Wi = Wi + Tmpr * Wpi - Tmpi * Wpr;

      while (i < n) {
        j = i + Mmax;
        Tmpr = Wr * Tmvl[j] - Wi * Tmvl[j-1];
        Tmpi = Wi * Tmvl[j] + Wr * Tmvl[j-1];

        Tmvl[j] = Tmvl[i] - Tmpr; Tmvl[j-1] = Tmvl[i-1] - Tmpi;
        Tmvl[i] = Tmvl[i] + Tmpr; Tmvl[i-1] = Tmvl[i-1] + Tmpi;
        i = i + Istp;
      }
    }
    Mmax = Istp;
  }
  let value;
  for (i = 0; i < Nft; i++) {
    j = i * 2;
    value = 2*Math.sqrt(Math.pow(Tmvl[j],2) + Math.pow(Tmvl[j+1],2))/Nvl;
    FTvl[i] = Math.round(value)

  }
  return FTvl
}
