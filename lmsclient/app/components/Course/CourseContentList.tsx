import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;  // данные
  activeVideo?: number; //активное видео (тогда наш набор активен) - необязательно
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  //состояние  видеоразделы
  const [visibleSections, setVisibleSections] = useState<Set<string>>( new Set<string>() )

  // Find unique video sections Найдем уникальные разделы видео
  const videoSections: string[] = [ 
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),  ];
//(tsconfig.json) Тип «Set<string>» можно перебирать только при использовании флага «--downlevelIteration» или
// с «--target» из «es2015» или выше. ts(2802) (свойство) данные: любые Нет быстрых исправлений

//всего кол-во видео// Total count of videos from previous sections
  let totalCount: number = 0; 


  const toggleSection = (section: string) => {
    //новый видимый раздел
    const newVisibleSections = new Set(visibleSections);
    
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
          } else { newVisibleSections.add(section); }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div className={`mt-[15px] w-full ${
         !props.isDemo && 'ml-[-30px] min-h-screen sticky top-24 left-0 z-30'}`}>
  {  // пройдем по видеосекциям
     videoSections.map((section: string, sectionIndex: number) => {  
         //раздел виден
        const isSectionVisible = visibleSections.has(section);
       // Filter videos by section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );

       const sectionVideoCount: number = sectionVideos.length; // Number of videos in the current section
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );

        const sectionStartIndex: number = totalCount; // Start index of videos within the current section
        totalCount += sectionVideoCount; // Update the total count of videos

        const sectionContentHours: number = sectionVideoLength / 60;  

        return (
          <div className={`${!props.isDemo && 'border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2'}`} key={section}>
            <div className="w-full flex">
              {/* Render video section */}
               <div className="w-full flex justify-between items-center"
              >
                <h2 className="text-[22px] text-black dark:text-white">{section} </h2>
      
                <button
                  className="mr-4 cursor-pointer text-black dark:text-white"
                  onClick={() => toggleSection(section)}
                >
      {/* стрелки верх и низ  - открыть секцию */}
          {isSectionVisible ? ( <BsChevronUp size={20} />  ) : ( <BsChevronDown size={20} />
                  )}
                </button>
              </div>  
            </div>
      
           <h5 className="text-black dark:text-white">
              {sectionVideoCount} Lessons ·{" "}
    {sectionVideoLength < 60 ? sectionVideoLength : sectionContentHours.toFixed(2)}{" "}
    {sectionVideoLength > 60 ? "hours" : "minutes"  //выводим минуты часы
          }
            </h5>  
            <br />
       {isSectionVisible && ( 
   //если виден добавляються эти разделы
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
               //индекс видео   
                  const videoIndex: number = sectionStartIndex + index; // Calculate the video index within the overall list
               //длина контента
                  const contentLength: number = item.videoLength / 60;
         return (
             <div
              //показывающие видео      
              className={`w-full ${
                        videoIndex === props.activeVideo ? "bg-slate-800" : ""
                      } cursor-pointer transition-all p-2`}
                      key={item._id}
                      onClick={() => props.isDemo ? null : props?.setActiveVideo(videoIndex)}
                    >
            <div className="flex items-start">
                        <div>
      <MdOutlineOndemandVideo size={25} className="mr-2" color="#1cdada" />
                        </div>
                        <h1 className="text-[18px] inline-block break-words text-black dark:text-white">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="pl-8 text-black dark:text-white">
    {item.videoLength > 60 ? contentLength.toFixed(2) : item.videoLength}{" "}
    {item.videoLength > 60 ? "hours" : "minutes"}
                      </h5>
              </div>
                  );
                })}
              </div>
            )}  
          </div>
        );
        })}  
    </div>
  );
};

export default CourseContentList;