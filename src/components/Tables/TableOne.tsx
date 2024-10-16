// import { BRAND } from '../../types/brand';
// import BrandOne from '../../images/brand/brand-01.svg';
// import BrandTwo from '../../images/brand/brand-02.svg';
// import BrandThree from '../../images/brand/brand-03.svg';
// import BrandFour from '../../images/brand/brand-04.svg';
// import BrandFive from '../../images/brand/brand-05.svg';
// import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
// import { useEffect } from 'react';
// import { getListUserAsync } from '../../services/auth/authSlice';

// const TableOne = () => {
//   const dispatch = useAppDispatch();

//   const { users, loading, error } = useAppSelector((state) => state.auth);
//   const token = localStorage.getItem('token') || '';

//   useEffect(() => {
//     // console.log('token', token);
    
//     if (token) {
//       dispatch(getListUserAsync({ page: 1, limit: 10, token }));
//     }
//   }, []);

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
//         Danh sách
//       </h4>

//       <div className="flex flex-col">
//         <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
//           <div className="p-2.5 xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">ID</h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Tên người dùng
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Email
//             </h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Tên đầy đủ
//             </h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Số điện thoại
//             </h5>
//           </div>
//         </div>

//         {users.map((user, key) => (
//           <div
//             className={`grid grid-cols-3 sm:grid-cols-5 ${
//               key === users.length - 1
//                 ? ''
//                 : 'border-b border-stroke dark:border-strokedark'
//             }`}
//             key={key}
//           >
//             <div className="flex items-center gap-3 p-2.5 xl:p-5">
//               <p className="hidden text-black dark:text-white sm:block">
//                 {user.id}
//               </p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-black dark:text-white">{user.name}K</p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-meta-3">${user.email}</p>
//             </div>

//             <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
//               <p className="text-black dark:text-white">{user.type_string}</p>
//             </div>

//             {/* <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
//               <p className="text-meta-5">{brand.conversion}%</p>
//             </div> */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TableOne;
