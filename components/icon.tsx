export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 58.76 64"
      {...props}
    >
      <path
        d="m11.12,36.08V7.91c0-3.39,2.77-6.16,6.16-6.16h24.2c3.39,0,6.16,2.77,6.16,6.16v22.99"
        fill="none"
        stroke="#1d1d1b"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3.5"
      />
      <path
        d="m47.65,41.42v14.66c0,3.39-2.77,6.16-6.16,6.16h-24.2c-3.39,0-6.16-2.77-6.16-6.16v-10.36"
        fill="none"
        stroke="#1d1d1b"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="3.5"
      />
      <path
        d="m10.95,26.63c-.31.13-.78.32-1.33.58-1.41.65-3.12,1.45-4.91,2.88-.97.77-1.67,1.38-2.28,2.4-.46.78-.73,1.69-.67,2.58.01.21.04.41.1.61.34,1.37,1.5,2.39,2.72,3.12,4.68,2.79,10.79,2.65,16.06,2.6,5.96-.06,11.92-.78,17.73-2.13,5.66-1.31,11.45-3.15,15.99-6.93.86-.72,1.67-1.54,2.18-2.54.5-1,.67-2.23.22-3.26-.16-.38-.6-1.33-3.03-2.51-1.28-.62-3.32-1.42-6.08-1.69"
        fill="none"
        stroke="#1d1d1b"
        strokeMiterlimit="10"
        strokeWidth="3.5"
      />
    </svg>
  ),
  favicon: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      {...props}
    >
      <g id="a" data-name="Ebene 2">
        <rect
          width="64"
          height="64"
          rx="14"
          ry="14"
          fill="#000"
          strokeWidth="0"
        />
      </g>
      <g id="b" data-name="Ebene 1">
        <path
          d="m19.59,31.64V14.71c0-2.3,1.88-4.19,4.19-4.19h16.44c2.3,0,4.19,1.88,4.19,4.19v13.41"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
        />
        <path
          d="m44.41,39.69v7.75c0,2.3-1.88,4.19-4.19,4.19h-16.44c-2.3,0-4.19-1.88-4.19-4.19v-4.83"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="3"
        />
        <path
          d="m19.48,27.45c-.21.09-.53.22-.9.39-.96.44-2.12.99-3.33,1.96-.66.53-1.14.94-1.55,1.63-.31.53-.5,1.15-.46,1.76,0,.14.03.28.06.42.23.93,1.02,1.63,1.85,2.12,3.18,1.9,7.33,1.8,10.91,1.77,4.05-.04,8.1-.53,12.05-1.45,3.84-.89,7.78-2.14,10.86-4.71.59-.49,1.14-1.04,1.48-1.73.34-.68.45-1.51.15-2.21-.11-.26-.41-.9-2.06-1.7-.87-.42-2.26-.96-4.13-1.15"
          fill="none"
          stroke="#fff"
          strokeMiterlimit="10"
          strokeWidth="3"
        />
      </g>
    </svg>
  ),
};
