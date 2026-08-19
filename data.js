/*此文件专门处理数据 */
const savedTasks = localStorage.getItem("stopScrollingTasks");

let tasks;

if (savedTasks === null)
{
    tasks = {};
}
else
{
    tasks = JSON.parse(savedTasks);
}

function saveTasks()
{
    localStorage.setItem(
        "stopScrollingTasks",
        JSON.stringify(tasks)
    );
}