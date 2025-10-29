// Auto-generated from Plan 99 days ss5 - IT - break links.csv.
// Do not edit manually; update the source CSV and regenerate if needed.

export type WorkoutResourceType = 'video' | 'form' | 'link';

export interface WorkoutResource {
  type: WorkoutResourceType;
  url: string;
}

export interface WorkoutItem {
  title: string;
  reps?: string;
  description?: string;
  notes?: string[];
  resources?: WorkoutResource[];
}

export type WorkoutDayType = 'workout' | 'test';

export interface WorkoutDay {
  date: string;
  type: WorkoutDayType;
  label?: string;
  week?: string;
  items: WorkoutItem[];
}

export const workoutPlan: WorkoutDay[] = [
  {
    "date": "2025-11-17",
    "type": "test",
    "label": "Test thể lực ban đầu",
    "items": [
      {
        "title": "Wall Sit Test (Squat Isometric Endurance)",
        "description": "Ý nghĩa: đánh giá sức bền cơ đùi trước (quadriceps), core hỗ trợ, thăng bằng cơ bản.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtube.com/shorts/mDdLC-yKudY?si=mwbSEjQNfrUUWFPs"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/148VQJCo6wP6hzY6GQ1r4WYIUeUrSw12zq-u8OlV-RR4/edit"
          }
        ]
      },
      {
        "title": "Plank Hold Test (Core Endurance)",
        "description": "Ý nghĩa: đo sức bền core, khả năng kiểm soát cột sống.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/PWd2VXg2Mpk?si=Pkkl6543gD69JuNQ"
          }
        ]
      },
      {
        "title": "Sit-to-Stand Test (Lower Body Strength & Coordination)",
        "description": "Ý nghĩa: sức mạnh, tốc độ, kiểm soát thăng bằng cơ bản.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ITv-_BkcrD0?si=HCfZ7am6JRDy-VoP"
          }
        ]
      },
      {
        "title": "Push-up Modified Test (Upper Body Endurance)",
        "description": "Ý nghĩa: sức mạnh – sức bền cơ ngực, vai, tay sau.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/sRpMzXzTLLo?si=wT3Tb331827PtxOE"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-19",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Buoi tap ngay 19/11/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/otiEptaKikE?si=NJ-mD_1nK8yfBpIc"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-20",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Buoi tap ngay 20/11/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/p9GPq3g5IDQ?si=p--YgEW_rPR2febW"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-21",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Buoi tap ngay 21/11/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/yeLfaC9XIzQ?si=MgCwgV-tVPiAAOfM"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-22",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Buoi tap ngay 22/11/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/iqViApU5zk8?si=y-fn92oa5G285TWW"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-23",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Buoi tap ngay 23/11/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/zVK1QxXPmaM?si=-QR3TqdZ51GSi1wB"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-24",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Buoi tap ngay 24/11/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/6NZcbG7wgsw?si=qj-WDYHrNrvzH2Q4"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-25",
    "type": "workout",
    "week": "19/11-25/11",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ybgqdffxrQE?si=TstQDJhanwuy25UZ"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-26",
    "type": "workout",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "Glute Bridge",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/SKOMwg1JLrU?si=qKCLbICsGgPwTcVZ"
          }
        ]
      },
      {
        "title": "Static Lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/NcUF3GJfh2Y?si=k_e8Aj6H0B4l0u8C"
          }
        ]
      },
      {
        "title": "Squat to chair",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/gST_9kPV9q4?si=7A0huYxE5gIFpeZV"
          }
        ]
      },
      {
        "title": "Incline Push-up",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/-KVhapnEtuk?si=eZUilLBXIk0ieSsd"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-27",
    "type": "workout",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "wall sit",
        "reps": "30s x 3 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtube.com/shorts/mDdLC-yKudY?si=95iIUv7kpfRDN9cz"
          }
        ]
      },
      {
        "title": "Plank",
        "reps": "30s x 3 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/mwlp75MS6Rg?si=BhftZeLT432Vi9Vk"
          }
        ]
      },
      {
        "title": "Bird dog",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ZdAHe9_HeEw?si=KYINJXjCtI1FJIXO"
          }
        ]
      },
      {
        "title": "Reverse Lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ZdAHe9_HeEw?si=KYINJXjCtI1FJIXO"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-28",
    "type": "workout",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "Single Leg Hip Bridge",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/lHXShY-FivU?si=O6IgHtqwkC4a1Enb"
          }
        ]
      },
      {
        "title": "Superman",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/8GGx1nyJl7Y?si=RUx_uZcI0wjyZRPL"
          }
        ]
      },
      {
        "title": "Side Lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/MvpBUsQrt_4?si=Yp9rgZFegdA-o80d"
          }
        ]
      },
      {
        "title": "Squat",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/P-yaD24bUE8?si=Qq1S74L3efr8GITB"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-29",
    "type": "workout",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "Prone Y raise",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/w1AWGKubE5U?si=W0waFDuIiBRkvPip"
          }
        ]
      },
      {
        "title": "Deadbug",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/jbWmbhElf3Q?si=2y_Rd1z6KH8yVE6k"
          }
        ]
      },
      {
        "title": "Hip Hinge Reach",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/gsyzx59A0eY?si=_8z7iEXR5d3RYIW6"
          }
        ]
      },
      {
        "title": "static lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/NcUF3GJfh2Y?si=k_e8Aj6H0B4l0u8C"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-11-30",
    "type": "workout",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "Side plank",
        "reps": "30s x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/44ND4bOB-T0?si=tu7G3nmOgxCjZTy3"
          }
        ]
      },
      {
        "title": "Forward Lunge",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/g8-Ge9S0aUw?si=m9P_BjJhmXZKIqL8"
          }
        ]
      },
      {
        "title": "Prone lying Sca retraction",
        "resources": [
          {
            "type": "video",
            "url": "https://youtube.com/shorts/lb1eCUnoRBI?si=tIQ2EtL7ZFFfYIpO"
          }
        ]
      },
      {
        "title": "Wall Slide",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/HXZQzLVyn5Q?si=U6X3ebbRWDxNGLDS"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-01",
    "type": "test",
    "label": "Test",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "Wall Sit Test (Squat Isometric Endurance)",
        "description": "Ý nghĩa: đánh giá sức bền cơ đùi trước (quadriceps), core hỗ trợ, thăng bằng cơ bản.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtube.com/shorts/mDdLC-yKudY?si=mwbSEjQNfrUUWFPs"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/1oYEz4wHKOiQ_f5M2SyPqeUsOucksC1VCIXrqJhDJgks/edit"
          }
        ]
      },
      {
        "title": "Plank Hold Test (Core Endurance)",
        "description": "Ý nghĩa: đo sức bền core, khả năng kiểm soát cột sống.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/PWd2VXg2Mpk?si=Pkkl6543gD69JuNQ"
          }
        ]
      },
      {
        "title": "Sit-to-Stand Test (Lower Body Strength & Coordination)",
        "description": "Ý nghĩa: sức mạnh, tốc độ, kiểm soát thăng bằng cơ bản.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ITv-_BkcrD0?si=HCfZ7am6JRDy-VoP"
          }
        ]
      },
      {
        "title": "Push-up Modified Test (Upper Body Endurance)",
        "description": "Ý nghĩa: sức mạnh – sức bền cơ ngực, vai, tay sau.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/sRpMzXzTLLo?si=wT3Tb331827PtxOE"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-02",
    "type": "workout",
    "week": "26/11-2/12",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ugXQe5hbUAA?si=scXE2Ohxq0Yo00EZ"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-03",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Dumbbell Floor Press",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/tXv-rEa5xn8?si=Qw-t207ZB4hwsl5u"
          }
        ]
      },
      {
        "title": "Dumbbell RDL",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/QFbZevA7dps?si=e_0hVzZbZEtDTpCw"
          }
        ]
      },
      {
        "title": "Goblet Squat",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/MWHIs0zxkCU?si=JMIsc_Q65R4AVWto"
          }
        ]
      },
      {
        "title": "Dumbbell static lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/BvnVtpQkrHE?si=q7mBkNbu7T2QcZfa"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-04",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Wall Sit + DB Curl",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/dohyKh5rm0E?si=k22674jUlhA5x09F"
          }
        ]
      },
      {
        "title": "Dumbbell reverse lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/RZKXLMxPF_I?si=VAZ_GOMzFk4vXaJs"
          }
        ]
      },
      {
        "title": "Dumbbell Single Leg Deadlift",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/lI8-igvsnVQ?si=h2CeHscMRL1kTuJT"
          }
        ]
      },
      {
        "title": "Dumbbell row",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/6gvmcqr226U?si=xnn32hewWgyio96-"
          }
        ]
      },
      {
        "title": "Glute bridge",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/SKOMwg1JLrU?si=qKCLbICsGgPwTcVZ"
          }
        ]
      },
      {
        "title": "Dumbbell lateral lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/HLDhxSqMQyE?si=mtPQvLSwD-V8cGP9"
          }
        ]
      },
      {
        "title": "Shoulder press",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/OM23fjJB3-0?si=C4KKptGyiJIqHEdR"
          }
        ]
      },
      {
        "title": "Dumbbell reverse fly",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/hf7jnF45N_I?si=DVvA4J9lN8HY_OJC"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-05",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Bear crawl hold",
        "reps": "30s x 2 set",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/6O_Otd8srus?si=2g90cojuQKrUQVbZ"
          }
        ]
      },
      {
        "title": "Dumbbell Front Squat",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/B86Zj72LwzA?si=TYBX83hyKKDMTHhy"
          }
        ]
      },
      {
        "title": "Dumbbell RDLs",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/QFbZevA7dps?si=e_0hVzZbZEtDTpCw"
          }
        ]
      },
      {
        "title": "Renegade row",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/LccyTxiUrhg?si=Elr8-JToSOg_vUPx"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-06",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Shoulder tap",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/8rgurWd-PB8?si=DXjXleioRUgGoZ8p"
          }
        ]
      },
      {
        "title": "Thruster",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/u3wKkZjE8QM?si=agO92F3_i5lAHQWP"
          }
        ]
      },
      {
        "title": "Dumbbell Forward lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/9gglI77Kzq8?si=Cl9IFnSi9OhhfD_M"
          }
        ]
      },
      {
        "title": "Lateral raise",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/XPPfnSEATJA?si=hHu8qcIn0itsti4f"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-07",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Deadbug",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/jbWmbhElf3Q?si=2y_Rd1z6KH8yVE6k"
          }
        ]
      },
      {
        "title": "Goblet Squat",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/MWHIs0zxkCU?si=JMIsc_Q65R4AVWto"
          }
        ]
      },
      {
        "title": "Dumbbell reverse lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/RZKXLMxPF_I?si=VAZ_GOMzFk4vXaJs"
          }
        ]
      },
      {
        "title": "Dumbbell front raise",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/xagEKj2yDc8?si=yItrLwC6Zy-UgW-x"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-08",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Side plank",
        "reps": "30s x 2 set",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/Oe9Tp9SvTCE?si=2OV1w9m8b0Hd5Dq2"
          }
        ]
      },
      {
        "title": "Dumbbell RDLs",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/QFbZevA7dps?si=e_0hVzZbZEtDTpCw"
          }
        ]
      },
      {
        "title": "Dumbbell reverse lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/RZKXLMxPF_I?si=VAZ_GOMzFk4vXaJs"
          }
        ]
      },
      {
        "title": "Dumbbell row",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/6gvmcqr226U?si=xnn32hewWgyio96-"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-09",
    "type": "workout",
    "week": "3/12-9/12",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/8aamtgabSP0?si=SzlpD1KmTg7KCWb5"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-10",
    "type": "workout",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Single-Leg Glute Bridge Hold",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/egs6m4J8u8c?si=p3js9eXOQXEuNKFP"
          }
        ]
      },
      {
        "title": "staggered stance squat",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/Arquoooy2EI?si=XyxqBJhPy0dlKeK0"
          }
        ]
      },
      {
        "title": "Dumbbell split squat",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/Py2Qeg-D5T0?si=79ZaIgsISPKRXMmB"
          }
        ]
      },
      {
        "title": "Renegade Row",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/G1AcX8Y_byg?si=OgQkH_xD2KPUH3ED"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-11",
    "type": "workout",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Lateral lunge to balance",
        "reps": "12 reps x 2 sets",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/WFmIGf0kyEs?si=dlbbz1Ly2QHIrRPQ"
          }
        ]
      },
      {
        "title": "Reverse Lunge + DB Bicep Curl",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/LEUIFTaYTgg?si=x7Cc2OMmKze8r0gV"
          }
        ]
      },
      {
        "title": "Dumbbell Single-Leg RDL",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/pJewPISyHjw?si=FbSoHRPAYdz-uRsJ"
          }
        ]
      },
      {
        "title": "Dumbbell Single-Arm Row",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/DmUX88nWClo?si=Zh9aak3Lrc2Ufkun"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-12",
    "type": "workout",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Russian twist",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/99T1EfpMwPA?si=8rhBc34w1Bnbg5CI"
          }
        ]
      },
      {
        "title": "Lunge to balance",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/UInwcEa5BH4?si=PnDPURHHETHJcBwA"
          }
        ]
      },
      {
        "title": "Thruster",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/u3wKkZjE8QM?si=agO92F3_i5lAHQWP"
          }
        ]
      },
      {
        "title": "Plank + DB Pull Through",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/Zko5x2SoQmo?si=SktLhi_wYwx1BIw4"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-13",
    "type": "workout",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Bird Dog",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/QVRtIHp9h-M?si=Czkb7j2LT22cuo0z"
          }
        ]
      },
      {
        "title": "Good Morning to Calf Raise",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/cMq3xYPRnVE?si=68U2jmMe49_Za90z"
          }
        ]
      },
      {
        "title": "Shoulder press",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/OM23fjJB3-0?si=C4KKptGyiJIqHEdR"
          }
        ]
      },
      {
        "title": "Dumbbell Floor Chest Fly",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/5jK8QhzvcDQ?si=zpoaWiV6fOGxcP7Y"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-14",
    "type": "workout",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Glute Bridge March",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/rXAbcneAr3I?si=PinJWR9-wzO0IlMe"
          }
        ]
      },
      {
        "title": "Thruster",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/u3wKkZjE8QM?si=agO92F3_i5lAHQWP"
          }
        ]
      },
      {
        "title": "staggered stance deadlift",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/RFuCfiMfJ1w?si=O0TYhXHMeL129uQ9"
          }
        ]
      },
      {
        "title": "Prone Y-T Raise",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/QdGTI4Lshg4?si=PzV9KqHZkLvYXYeY"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-15",
    "type": "test",
    "label": "Test",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Wall Sit Test (Squat Isometric Endurance)",
        "description": "Ý nghĩa: đánh giá sức bền cơ đùi trước (quadriceps), core hỗ trợ, thăng bằng cơ bản.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtube.com/shorts/mDdLC-yKudY?si=mwbSEjQNfrUUWFPs"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/1isosD4GCd2cKE0096RZfiA3D2thI5duvuXEJWO6EfUQ/edit?usp=drive_web&ouid=115419682721327111535"
          }
        ]
      },
      {
        "title": "Plank Hold Test (Core Endurance)",
        "description": "Ý nghĩa: đo sức bền core, khả năng kiểm soát cột sống.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/PWd2VXg2Mpk?si=Pkkl6543gD69JuNQ"
          }
        ]
      },
      {
        "title": "Sit-to-Stand Test (Lower Body Strength & Coordination)",
        "description": "Ý nghĩa: sức mạnh, tốc độ, kiểm soát thăng bằng cơ bản.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ITv-_BkcrD0?si=HCfZ7am6JRDy-VoP"
          }
        ]
      },
      {
        "title": "Push-up Modified Test (Upper Body Endurance)",
        "description": "Ý nghĩa: sức mạnh – sức bền cơ ngực, vai, tay sau.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/sRpMzXzTLLo?si=wT3Tb331827PtxOE"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-16",
    "type": "workout",
    "week": "10/12-16/12",
    "items": [
      {
        "title": "Stretching"
      }
    ]
  },
  {
    "date": "2025-12-17",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Buoi tap ngay 17/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ksv7McbVeqE?si=6XQBX94sqZItZp5j"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-18",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Buoi tap ngay 18/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=9FBIaqr7TjQ&t=362s"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-19",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Buoi tap ngay 19/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/qbH5CCSaHWw?si=VyvDWu73jTo1vyKn"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-20",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Buoi tap ngay 20/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=fu4ZL6DQpPk&list=PLvf_LH4Nzg10snQeK-hTtusAaLgmI9z1I&index=6"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-21",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Buoi tap ngay 21/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/xYoKWuCbHnw?si=BHLkxPrsgXFdI7xW"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-22",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Buoi tap ngay 22/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/L6M0j6AwDGQ?si=cy4U53WSB3UvG1Bx"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-23",
    "type": "workout",
    "week": "17/12-23/12",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ugXQe5hbUAA?si=4BW434EHW4l-vDL9"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-24",
    "type": "workout",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Buoi tap ngay 24/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/EohSREiJGXQ?si=alTzdD6OaMuDyBfK"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-25",
    "type": "workout",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Buoi tap ngay 25/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=rEEZB68GTs0&list=PLvf_LH4Nzg11rCBiF2hK3A65U0nAQns-1&index=5"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-26",
    "type": "workout",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Buoi tap ngay 26/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=o_YwpJm-otw&list=PLvf_LH4Nzg11rCBiF2hK3A65U0nAQns-1&index=11"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-27",
    "type": "workout",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Buoi tap ngay 27/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/IOFNQxlWNJQ?si=z7LeiZkauDU93BJn"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-28",
    "type": "workout",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Buoi tap ngay 28/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=yyasWsuZ-W8&list=PLvf_LH4Nzg11rCBiF2hK3A65U0nAQns-1&index=13"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-29",
    "type": "test",
    "label": "Test",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Dumbbell Goblet Squat Endurance Test",
        "description": "Ý nghĩa: đánh giá sức bền cơ chân, khả năng kiểm soát squat có tải.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/2LnkzQ7paAc?si=i5CXpLNICVq7BhwI"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/14-km-bPOgpyBGnAvkjI2KfDzWnLHXtMOm2b0WlQSX4w/edit#responses"
          }
        ]
      },
      {
        "title": "Dumbbell Step-Back Lunge Test",
        "description": "Ý nghĩa: đo sức mạnh, thăng bằng, phối hợp lower body + core.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/YSUvTHwHmgQ?si=e9qmISO2-pvcIAV8"
          }
        ]
      },
      {
        "title": "Push up test",
        "description": "Ý nghĩa: sức mạnh – sức bền cơ ngực, vai, tay sau.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/sRpMzXzTLLo?si=wT3Tb331827PtxOE"
          }
        ]
      },
      {
        "title": "Dumbbell Deadlift-to-Row",
        "description": "Ý nghĩa: sức mạnh + coordination (hip hinge + pull).",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/q0yZlQuWD5U?si=mfCRe9uYjXFmXPuN"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-30",
    "type": "workout",
    "week": "24/12-30/12",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/8lkJi4ldZ90?si=yrHtDOSkhnQHWrGP"
          }
        ]
      }
    ]
  },
  {
    "date": "2025-12-31",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Buoi tap ngay 31/12/2025",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=moaslAr2NQc&list=PLhu1QCKrfgPWo9oKju5-hPg85TsOwR93m&index=5"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-01",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Buoi tap ngay 01/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/-7V14if67_8?si=NDveMHU6Nn0KftJ6"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-02",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Buoi tap ngay 02/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/VnmUfR4b8eE?si=xEPQlku3JHzBwYFP"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-03",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Buoi tap ngay 03/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/_UFvhXTN2-U?si=00XeehMwz0V2ZBZ7"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-04",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Buoi tap ngay 04/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/kK5QYRrJkGk?si=lkygu8h6ctqQJirF"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-05",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Buoi tap ngay 05/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ZZI__bqlBkQ?si=kJAl8ic3o0Qb4ME8"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-06",
    "type": "workout",
    "week": "31/12 -06/01",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/6zzeSJxJS4s?si=7i8XVX9oMJl-QH-b"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-07",
    "type": "workout",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Buoi tap ngay 07/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=ku220k-E3F4&list=PL3D3ysBMhKYUsuyVLdFUUNbV8D407ttqo"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-08",
    "type": "workout",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Buoi tap ngay 08/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=R50YycOCerE&list=PL3D3ysBMhKYUsuyVLdFUUNbV8D407ttqo&index=2"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-09",
    "type": "workout",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Buoi tap ngay 09/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=Tm9PwvUyRy8&list=PL3D3ysBMhKYXCgbmAwfsU5X_7PAkFgtuv&index=15"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-10",
    "type": "workout",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Buoi tap ngay 10/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=-PMyC5HTokw&list=PL3D3ysBMhKYXCgbmAwfsU5X_7PAkFgtuv&index=16"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-11",
    "type": "workout",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Buoi tap ngay 11/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/6NZcbG7wgsw?si=IZ8CpLAw0YhOcBxx"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-12",
    "type": "test",
    "label": "Test",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Dumbbell Goblet Squat Endurance Test",
        "description": "Ý nghĩa: đánh giá sức bền cơ chân, khả năng kiểm soát squat có tải.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/2LnkzQ7paAc?si=i5CXpLNICVq7BhwI"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/1BtEw-caONMXJ22iFPmLpiY8tJtU6P_y2idfpTcUkiIg/edit#responses"
          }
        ]
      },
      {
        "title": "Dumbbell Step-Back Lunge Test",
        "description": "Ý nghĩa: đo sức mạnh, thăng bằng, phối hợp lower body + core.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/YSUvTHwHmgQ?si=e9qmISO2-pvcIAV8"
          }
        ]
      },
      {
        "title": "Push up test",
        "description": "Ý nghĩa: sức mạnh – sức bền cơ ngực, vai, tay sau.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/sRpMzXzTLLo?si=wT3Tb331827PtxOE"
          }
        ]
      },
      {
        "title": "Dumbbell Deadlift-to-Row",
        "description": "Ý nghĩa: sức mạnh + coordination (hip hinge + pull).",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/q0yZlQuWD5U?si=mfCRe9uYjXFmXPuN"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-13",
    "type": "workout",
    "week": "07/01-13/01",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/q1vPLx1YZ-s?si=ogmttyAGnhZrnTMi"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-14",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Buoi tap ngay 14/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/XYtntRKzzRY?si=ioKspTR0xWdqRs_C"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-15",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Buoi tap ngay 15/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/E0fDh1hV4rw?si=KjP60H2zvHhxCm18"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-16",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Buoi tap ngay 16/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=yM_7EFy1qgI&list=PLvf_LH4Nzg13CyzAALcLCkX3B9Os_FLMq&index=5"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-17",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Buoi tap ngay 17/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=L6M0j6AwDGQ&list=PLvf_LH4Nzg13CyzAALcLCkX3B9Os_FLMq&index=8"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-18",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Buoi tap ngay 18/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/uSyH0dZu8TM?si=arQ7o1t3BLP224XO"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-19",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Buoi tap ngay 19/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=UjwKKl157hw&list=PLvf_LH4Nzg13CyzAALcLCkX3B9Os_FLMq&index=23"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-20",
    "type": "workout",
    "week": "14/01-20/01",
    "items": [
      {
        "title": "Mobility",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/Ysk4bkyIl1s?si=JcStrn_l9DDIcsqH"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-21",
    "type": "workout",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Buoi tap ngay 21/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ksv7McbVeqE?si=wdhNZyEQ3xB82rLh"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-22",
    "type": "workout",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Buoi tap ngay 22/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=QzF7o4sjoYo&list=PLN99XDk2SYr69xruWQk-e0SKzGs6oxKFJ&index=11"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-23",
    "type": "workout",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Buoi tap ngay 23/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=6zIaiaeWRWQ&list=PLN99XDk2SYr69xruWQk-e0SKzGs6oxKFJ&index=23"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-24",
    "type": "workout",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Buoi tap ngay 24/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/pKhKqYBP7qQ?si=03-efm4HdaRR-TKN"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-25",
    "type": "workout",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Buoi tap ngay 25/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/7WzCds5u8GI?si=7V9Fk04iFlGc6Asa"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-26",
    "type": "test",
    "label": "Test",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Dumbbell Thruster Test",
        "description": "Ý nghĩa: đo sức mạnh toàn thân + coordination + nhịp tim.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/M5gEwLTtWbg?si=5rl87REHwSxtPSxE"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/1gpk1dCoK8AihQNEFb4vCSNNhODN9DcUDx4XZGH3PhiY/edit"
          }
        ]
      },
      {
        "title": "Dumbbell Step-Up Test",
        "description": "Ý nghĩa: sức mạnh chân + thăng bằng + cardio nhẹ.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/9ZknEYboBOQ?si=d6eVUlsAXOq8V8xA"
          }
        ]
      },
      {
        "title": "Dumbbell Deadlift-to-Row",
        "description": "Ý nghĩa: sức mạnh + coordination (hip hinge + pull).",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/q0yZlQuWD5U?si=mfCRe9uYjXFmXPuN"
          }
        ]
      },
      {
        "title": "Modified Burpee Test",
        "description": "Ý nghĩa: đo công suất tim mạch + coordination toàn thân.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/auBLPXO8Fww?si=1M4zJbq2ETCKQTH-"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-27",
    "type": "workout",
    "week": "21/01-27/01",
    "items": [
      {
        "title": "Mobility",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/_SJ1B26GIaE?si=SZqOcFQp1rpUi6D_"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-28",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Buoi tap ngay 28/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=JiAT6ndBYbM&list=PL7zoYQ-ormEpN8uLPQ6r-YJgisRFcjv79"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-29",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Buoi tap ngay 29/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=jOW52x83xvo&list=PL7zoYQ-ormEpN8uLPQ6r-YJgisRFcjv79&index=2"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-30",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Buoi tap ngay 30/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=Xfr5D3_zCRQ&list=PL7zoYQ-ormEpN8uLPQ6r-YJgisRFcjv79&index=3"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-01-31",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Buoi tap ngay 31/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/LiI1ZOWYmiE?si=sfuJjlmDgylHqCoV"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-01",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Buoi tap ngay 31/01/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/LiI1ZOWYmiE?si=sfuJjlmDgylHqCoV"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-02",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Buoi tap ngay 02/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/GMZJe7wZ21A?si=HG7kAaIBCiOSuLYO"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-03",
    "type": "workout",
    "week": "28/01-03/02",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/2eC7TlC2NLs?si=CflnMcSZc_cBU7JC"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-04",
    "type": "workout",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Buoi tap ngay 04/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/1aXc6CJPX40?si=UgvldpXmk8x0JurK"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-05",
    "type": "workout",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Buoi tap ngay 05/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/UhOfpsZ4kho?si=4b8YNAzRfrV0gsXU"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-06",
    "type": "workout",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Buoi tap ngay 06/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/hPvOI657rno?si=wWOoyfrKh8YlIAZN"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-07",
    "type": "workout",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Buoi tap ngay 07/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/_PRk8DH2_mY?si=ISbOXawVDiX5d7YF"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-08",
    "type": "workout",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Buoi tap ngay 08/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/y-uAqSyMbnQ?si=E4414tcTOlKpfk-y"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-09",
    "type": "test",
    "label": "Test",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Dumbbell Thruster Test",
        "description": "Ý nghĩa: đo sức mạnh toàn thân + coordination + nhịp tim.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/M5gEwLTtWbg?si=5rl87REHwSxtPSxE"
          },
          {
            "type": "form",
            "url": "https://docs.google.com/forms/d/1YYtjmp_oyfY-kgCmGPee78COBj9743j4qhF1n2CvTEw/edit"
          }
        ]
      },
      {
        "title": "Dumbbell Step-Up Test",
        "description": "Ý nghĩa: sức mạnh chân + thăng bằng + cardio nhẹ.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/9ZknEYboBOQ?si=d6eVUlsAXOq8V8xA"
          }
        ]
      },
      {
        "title": "Dumbbell Deadlift-to-Row",
        "description": "Ý nghĩa: sức mạnh + coordination (hip hinge + pull).",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/q0yZlQuWD5U?si=mfCRe9uYjXFmXPuN"
          }
        ]
      },
      {
        "title": "Modified Burpee Test",
        "description": "Ý nghĩa: đo công suất tim mạch + coordination toàn thân.",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/auBLPXO8Fww?si=1M4zJbq2ETCKQTH-"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-10",
    "type": "workout",
    "week": "04/02-10/02",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/gKjgJ5k3i7c?si=tITi3uNbwJhFpQcB"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-11",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Buoi tap ngay 11/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/Zkf92N_lkTU?si=lj80-Hni8oEgUD8-"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-12",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Buoi tap ngay 12/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/y-uAqSyMbnQ?si=yeRHwL8mHdzTybMh"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-13",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Buoi tap ngay 13/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=RPbscYct3I4&list=PLvf_LH4Nzg12rnMgCf5ZX96gn-15Pz9rf&index=3"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-14",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Buoi tap ngay 14/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/4m_aYuPPobU?si=PhgJxCMTeB1zabOr"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-15",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Buoi tap ngay 15/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/XYtntRKzzRY?si=D14_AHr39SlWvUSZ"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-16",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Buoi tap ngay 16/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/E0fDh1hV4rw?si=RvlKzAQlCXvLej7K"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-17",
    "type": "workout",
    "week": "11/02-17/02",
    "items": [
      {
        "title": "Stretching",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/rJZw__B-RmY?si=6DzETyzRjY_qF45T"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-18",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Buoi tap ngay 18/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/RWSuiK4NjOE?si=RoWJuKXR8iur4V7l"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-19",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Buoi tap ngay 19/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/rrTA3PumQnw?si=3nPKCqGFUbGIg1n6"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-20",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Buoi tap ngay 20/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=7OpnaUkEEGc&list=PLEmcpl-1-EbL6Q2ho3YhsRdqLsw-UAWhj&index=49"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-21",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Buoi tap ngay 21/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/H2Wrx4cksj8?si=on_ePQ5k-e1N5Fbb"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-22",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Buoi tap ngay 22/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/p487bM94LnY?si=nCohh8ZV_Id9OU8h"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-23",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Buoi tap ngay 23/02/2026",
        "resources": [
          {
            "type": "video",
            "url": "https://www.youtube.com/watch?v=8UId6ERaShs&list=PLEmcpl-1-EbL6Q2ho3YhsRdqLsw-UAWhj&index=81"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-24",
    "type": "workout",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "Mobility",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/ovUtlbbKb_4?si=zo5Nxgzs0cOERUnA"
          }
        ]
      }
    ]
  },
  {
    "date": "2026-02-25",
    "type": "test",
    "label": "Final day",
    "week": "18/02-24/02",
    "items": [
      {
        "title": "1 phút",
        "reps": "20 phút Nam :DB 10 kí Nữ : DB 5 kí",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/PWd2VXg2Mpk?si=Pkkl6543gD69JuNQ"
          }
        ]
      },
      {
        "title": "20 reps",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/sRpMzXzTLLo?si=wT3Tb331827PtxOE"
          }
        ]
      },
      {
        "title": "Dumbbell Thruster Test",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/M5gEwLTtWbg?si=5rl87REHwSxtPSxE"
          }
        ]
      },
      {
        "title": "Dumbbell RDL",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/QFbZevA7dps?si=e_0hVzZbZEtDTpCw"
          }
        ]
      },
      {
        "title": "Forward Lunge",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/g8-Ge9S0aUw?si=m9P_BjJhmXZKIqL8"
          }
        ]
      },
      {
        "title": "Shoulder press",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/OM23fjJB3-0?si=C4KKptGyiJIqHEdR"
          }
        ]
      },
      {
        "title": "Dumbbell Deadlift-to-Row",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/q0yZlQuWD5U?si=mfCRe9uYjXFmXPuN"
          }
        ]
      },
      {
        "title": "Modified Burpee Test",
        "resources": [
          {
            "type": "video",
            "url": "https://youtu.be/auBLPXO8Fww?si=1M4zJbq2ETCKQTH-"
          }
        ]
      }
    ]
  }
];

export const workoutPlanByDate: Record<string, WorkoutDay> = workoutPlan.reduce((map, day) => {
  map[day.date] = day;
  return map;
}, {} as Record<string, WorkoutDay>);

export const workoutDates = workoutPlan.map((day) => day.date);

export const firstWorkoutDate = workoutPlan[0]?.date;
export const lastWorkoutDate = workoutPlan[workoutPlan.length - 1]?.date;

export function getWorkoutForDate(date: string) {
  return workoutPlanByDate[date];
}
