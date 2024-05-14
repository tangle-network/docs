function HeaderLogo() {
  return (
    <div className="flex items-center align-middle">
      <a
        href="https://docs.tangle.tools"
        target="_blank"
        rel="noreferrer"
        title="Tangle Homepage"
        className="mr-2" // Add some right margin to create spacing
      >
        <svg
          width="130"
          height="60"
          viewBox="0 0 453 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_4390_53415)">
            <path
              d="M128 131.839C128.006 125.442 125.102 119.304 119.927 114.773C114.752 110.243 107.729 107.688 100.398 107.672L69.7935 107.672C69.601 105.183 69.4798 102.638 69.4798 100C69.4798 97.3618 69.3586 94.8293 69.1874 92.328L100.398 92.328C107.665 92.2262 114.595 89.6356 119.693 85.1151C124.791 80.5945 127.648 74.5064 127.648 68.164C127.648 61.8216 124.791 55.7335 119.693 51.2129C114.595 46.6924 107.665 44.1018 100.398 44L27.2529 44C19.9856 44.1018 13.0554 46.6924 7.95744 51.2129C2.85945 55.7335 0.00227278 61.8216 0.0022725 68.164C0.00227223 74.5064 2.85945 80.5945 7.95744 85.1151C13.0554 89.6356 19.9856 92.2262 27.2529 92.328L56 93C58 93 58.1708 97.3618 58.1708 100C58.1708 102.638 58.292 105.171 58.4631 107.672L27.2529 107.672C19.9856 107.774 13.0554 110.364 7.95744 114.885C2.85945 119.405 0.00227 125.494 0.00226972 131.836C0.00226944 138.178 2.85945 144.267 7.95744 148.787C13.0554 153.308 19.9856 155.898 27.2528 156L100.398 156C107.727 155.984 114.75 153.43 119.925 148.901C125.1 144.371 128.004 138.235 128 131.839ZM116.691 68.1609C116.693 71.9362 114.978 75.558 111.924 78.2316C108.869 80.9052 104.724 82.4123 100.398 82.4222L67.9895 82.4222C66.8155 75.3524 64.5787 68.4485 61.3367 61.8889C59.9073 59.0468 58.0773 56.3713 55.889 53.9244L100.398 53.9244C104.719 53.9343 108.86 55.438 111.914 58.1062C114.968 60.7745 116.685 64.3899 116.691 68.1609ZM27.2529 82.4222C22.9184 82.4222 18.7614 80.9197 15.6965 78.2452C12.6316 75.5707 10.9097 71.9432 10.9097 68.1609C10.9097 64.3785 12.6316 60.7511 15.6965 58.0766C18.7614 55.4021 22.9184 53.8996 27.2529 53.8996L34.5902 53.8996C41.0718 53.8996 47.2112 58.3796 51.0331 65.8898C53.6494 71.1816 55.5102 76.7341 56.5736 82.4222L27.2529 82.4222ZM10.9596 131.839C10.9577 128.064 12.6721 124.442 15.7267 121.768C18.7812 119.095 22.9264 117.588 27.2529 117.578L59.6611 117.578C60.8351 124.648 63.0719 131.551 66.3138 138.111C67.7433 140.953 69.5733 143.629 71.7616 146.076L27.2528 146.076C22.9314 146.066 18.7905 144.562 15.7367 141.894C12.683 139.226 10.9653 135.61 10.9596 131.839ZM76.6602 134.11C74.0439 128.818 72.1832 123.266 71.1198 117.578L100.398 117.578C104.732 117.578 108.889 119.08 111.954 121.755C115.019 124.429 116.741 128.057 116.741 131.839C116.741 135.621 115.019 139.249 111.954 141.923C108.889 144.598 104.732 146.1 100.398 146.1L93.0604 146.1C86.6073 146.1 80.4679 141.62 76.6602 134.11Z"
              fill="url(#paint0_linear_4390_53415)"
            />
            <path
              opacity="0.8"
              d="M128 68.1609C128.006 74.5579 125.102 80.6956 119.927 85.2265C114.752 89.7575 107.728 92.3115 100.397 92.328L69.7925 92.328C69.6 94.8169 69.4788 97.3618 69.4788 100C69.4788 102.638 69.3575 105.171 69.1864 107.672L100.397 107.672C107.665 107.774 114.595 110.364 119.693 114.885C124.791 119.405 127.648 125.494 127.648 131.836C127.648 138.178 124.791 144.267 119.693 148.787C114.595 153.308 107.665 155.898 100.397 156L27.2511 156C19.9837 155.898 13.0534 153.308 7.95531 148.787C2.85723 144.267 2.52904e-07 138.178 3.28536e-07 131.836C4.04168e-07 125.494 2.85723 119.405 7.95531 114.885C13.0534 110.364 19.9837 107.774 27.2511 107.672L55.9987 107C57.9988 107 58.1696 102.638 58.1696 100C58.1696 97.3618 58.2908 94.8293 58.4619 92.328L27.2511 92.328C19.9837 92.2262 13.0534 89.6356 7.95531 85.1151C2.85723 80.5945 1.01219e-06 74.5064 1.08782e-06 68.164C1.16345e-06 61.8216 2.85723 55.7335 7.95531 51.2129C13.0534 46.6924 19.9837 44.1018 27.2511 44L100.397 44C107.727 44.0165 114.75 46.5697 119.925 51.0993C125.1 55.6289 128.004 61.7649 128 68.1609ZM116.691 131.839C116.693 128.064 114.978 124.442 111.924 121.768C108.869 119.095 104.724 117.588 100.397 117.578L67.9885 117.578C66.8144 124.648 64.5775 131.551 61.3356 138.111C59.9061 140.953 58.076 143.629 55.8877 146.076L100.397 146.076C104.719 146.066 108.86 144.562 111.914 141.894C114.967 139.226 116.685 135.61 116.691 131.839ZM27.2511 117.578C22.9165 117.578 18.7595 119.08 15.6945 121.755C12.6295 124.429 10.9076 128.057 10.9076 131.839C10.9076 135.621 12.6295 139.249 15.6945 141.923C18.7595 144.598 22.9165 146.1 27.2511 146.1L34.5885 146.1C41.0703 146.1 47.2097 141.62 51.0318 134.11C53.6481 128.818 55.5089 123.266 56.5723 117.578L27.2511 117.578ZM10.9575 68.1609C10.9556 71.9362 12.6701 75.558 15.7247 78.2316C18.7793 80.9052 22.9246 82.4123 27.2511 82.4222L59.6599 82.4222C60.8339 75.3524 63.0708 68.4485 66.3128 61.8889C67.7422 59.0468 69.5723 56.3713 71.7606 53.9245L27.2511 53.9245C22.9295 53.9343 18.7885 55.438 15.7347 58.1062C12.6809 60.7745 10.9632 64.3899 10.9575 68.1609ZM76.6593 65.8898C74.043 71.1816 72.1822 76.7341 71.1188 82.4222L100.397 82.4222C104.732 82.4222 108.889 80.9197 111.954 78.2452C115.019 75.5707 116.741 71.9432 116.741 68.1609C116.741 64.3786 115.019 60.7511 111.954 58.0766C108.889 55.4021 104.732 53.8996 100.397 53.8996L93.0598 53.8996C86.6066 53.8996 80.4671 58.3796 76.6593 65.8898Z"
              fill="url(#paint1_linear_4390_53415)"
            />
          </g>
          <path
            d="M193.24 76.392V132H179.632V76.392H193.24ZM161.992 82.44V69.84H210.88V82.44H161.992ZM227.615 133.092C223.191 133.092 219.663 131.888 217.031 129.48C214.455 127.016 213.167 123.74 213.167 119.652C213.167 115.788 214.483 112.708 217.115 110.412C219.803 108.116 223.667 106.772 228.707 106.38L240.467 105.456V104.784C240.467 103.384 240.187 102.236 239.627 101.34C239.067 100.388 238.255 99.688 237.191 99.24C236.183 98.736 234.895 98.484 233.327 98.484C230.583 98.484 228.483 98.988 227.027 99.996C225.627 101.004 224.927 102.46 224.927 104.364H214.175C214.175 101.172 214.987 98.4 216.611 96.048C218.235 93.696 220.531 91.876 223.499 90.588C226.523 89.3 230.023 88.656 233.999 88.656C238.087 88.656 241.531 89.384 244.331 90.84C247.187 92.296 249.343 94.424 250.799 97.224C252.311 100.024 253.067 103.44 253.067 107.472V132H241.643L240.803 126.456C240.131 128.36 238.535 129.956 236.015 131.244C233.551 132.476 230.751 133.092 227.615 133.092ZM232.151 123.516C234.615 123.516 236.631 122.928 238.199 121.752C239.767 120.52 240.551 118.7 240.551 116.292V114.024L233.999 114.612C231.199 114.836 229.211 115.312 228.035 116.04C226.915 116.712 226.355 117.72 226.355 119.064C226.355 120.576 226.831 121.696 227.783 122.424C228.735 123.152 230.191 123.516 232.151 123.516ZM280.321 132H267.385V90H279.565L280.405 94.368C281.693 92.576 283.457 91.176 285.697 90.168C287.993 89.16 290.513 88.656 293.257 88.656C298.241 88.656 302.105 90.196 304.849 93.276C307.649 96.3 309.049 100.556 309.049 106.044V132H296.113V109.152C296.113 106.52 295.441 104.42 294.097 102.852C292.753 101.228 290.961 100.416 288.721 100.416C286.145 100.416 284.101 101.2 282.589 102.768C281.077 104.28 280.321 106.352 280.321 108.984V132ZM321.267 110.244C321.267 105.988 322.107 102.236 323.787 98.988C325.523 95.74 327.903 93.192 330.927 91.344C334.007 89.496 337.507 88.572 341.427 88.572C344.731 88.572 347.559 89.244 349.911 90.588C352.319 91.932 353.971 93.696 354.867 95.88L353.607 96.72L354.615 90H366.795V129.312C366.795 134.296 365.871 138.58 364.023 142.164C362.175 145.804 359.543 148.576 356.127 150.48C352.711 152.44 348.595 153.42 343.779 153.42C337.339 153.42 332.103 151.684 328.071 148.212C324.039 144.796 321.715 140.12 321.099 134.184H334.203C334.315 136.536 335.211 138.356 336.891 139.644C338.571 140.988 340.839 141.66 343.695 141.66C346.831 141.66 349.295 140.792 351.087 139.056C352.935 137.32 353.859 134.968 353.859 132V123.096L355.287 124.188C354.391 126.372 352.655 128.136 350.079 129.48C347.503 130.824 344.535 131.496 341.175 131.496C337.255 131.496 333.783 130.6 330.759 128.808C327.791 127.016 325.467 124.524 323.787 121.332C322.107 118.14 321.267 114.444 321.267 110.244ZM334.287 109.908C334.287 111.924 334.707 113.716 335.547 115.284C336.387 116.796 337.535 118 338.991 118.896C340.447 119.792 342.127 120.24 344.031 120.24C345.991 120.24 347.699 119.82 349.155 118.98C350.667 118.084 351.815 116.88 352.599 115.368C353.439 113.8 353.859 111.98 353.859 109.908C353.859 107.836 353.439 106.072 352.599 104.616C351.815 103.104 350.667 101.928 349.155 101.088C347.699 100.248 345.963 99.828 343.947 99.828C342.043 99.828 340.363 100.248 338.907 101.088C337.451 101.928 336.303 103.104 335.463 104.616C334.679 106.128 334.287 107.892 334.287 109.908ZM394.499 132H381.563V68.664H394.499V132ZM428.731 133.092C424.531 133.092 420.779 132.14 417.475 130.236C414.227 128.332 411.651 125.728 409.747 122.424C407.899 119.064 406.975 115.228 406.975 110.916C406.975 106.548 407.871 102.712 409.663 99.408C411.511 96.048 414.059 93.416 417.307 91.512C420.555 89.608 424.279 88.656 428.479 88.656C432.903 88.656 436.711 89.58 439.903 91.428C443.095 93.22 445.559 95.796 447.295 99.156C449.031 102.46 449.899 106.408 449.899 111V114.276L413.779 114.444L413.947 106.464H437.047C437.047 104.224 436.291 102.46 434.779 101.172C433.267 99.828 431.195 99.156 428.563 99.156C426.379 99.156 424.587 99.576 423.187 100.416C421.843 101.256 420.835 102.572 420.163 104.364C419.491 106.1 419.155 108.34 419.155 111.084C419.155 115.004 419.939 117.916 421.507 119.82C423.131 121.668 425.623 122.592 428.983 122.592C431.447 122.592 433.491 122.172 435.115 121.332C436.739 120.492 437.775 119.316 438.223 117.804H450.067C449.339 122.452 447.043 126.176 443.179 128.976C439.315 131.72 434.499 133.092 428.731 133.092Z"
            fill="currentColor"
            className=" fill-[#1F1D2B] dark:fill-white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_4390_53415"
              x1="9.53849"
              y1="51.0933"
              x2="106.116"
              y2="161.468"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8E59FF" />
              <stop offset="1" stopColor="#6888F9" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_4390_53415"
              x1="9.53639"
              y1="148.907"
              x2="106.114"
              y2="38.5305"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8E59FF" />
              <stop offset="1" stopColor="#6888F9" />
            </linearGradient>
            <clipPath id="clip0_4390_53415">
              <rect
                width="112"
                height="128"
                fill="white"
                transform="translate(128 44) rotate(90)"
              />
            </clipPath>
          </defs>
        </svg>
      </a>

      <span className="bg-blue-100 text-blue-800 text-lg font-semibold mt-1 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-2">
        DOCS
      </span>
    </div>
  );
}

export default HeaderLogo;
