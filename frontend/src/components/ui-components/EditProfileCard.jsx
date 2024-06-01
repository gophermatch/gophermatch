
/*
type qnaAnswers = {
  question: string,
  answer: string
}[]

type aptOrDormData = {
  top5: string[]
} | {
  aptName?: string,
  bed: number,
  bath: number,
  monthlyRent: number,
  tags: string[]
}
*/
export function EditProfileCard({
  name,
  major,
  bio,
  pictureUrls,
  qnaAnswers,
  aptOrDormData,
}) {
  return (
    <div className={`m-auto w-[65vw] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
      <div className={"w-full flex flex-col h-[70vh] mb-[4vh] bg-white rounded-3xl overflow-hidden"}>
        <div className={"flex p-[4vh] h-full w-full gap-[3vh]"}>
          <div className="w-[30vh] h-full border-solid border-2 border-red">
            {/* Carousel */}
          </div>
          <div className="flex flex-col gap-[3vh] grow">
            <div className="grow border-solid border-2 border-maroon">
              {/* Name, bio */}
            </div>
            <div className="flex grow gap-[3vh]">
              <div className="grow-[3] border-solid border-2 border-gold">
                {/* Apt/Dorm */}
              </div>
              <div className="grow-[2] border-solid border-2 border-gold">
                {/* Qna */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
