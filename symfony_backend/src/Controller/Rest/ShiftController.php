<?php

// src/Controller/Rest/ShiftControler.php
namespace App\Controller\Rest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\UnitOfWork;
use Doctrine\DoctrineCollection;
use Symfony\Component\HttpFoundation\JsonResponse;


use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;
 
 
use Symfony\Component\HttpFoundation\Request;
 
use App\Entity\User;
use App\Entity\Shift;
use App\Specific;;

class ShiftController extends AbstractController
{
	/**
	 //hmm: symfony hides routes in the /comments/
     * Retrieves a Shift resource
     * @Rest\Get("/shift/{id}/{includeUsers}")
 
     * @param int $shiftId
     * @return JSON
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function get(string $id, $includeUsers=false)
    {
		if($id != 'null') {
			$entity = $this->getDoctrine()->getRepository(Shift::class)->find($id);
			$startTime = $entity->getStartTime();
			$endTime = $entity->getEndTime();
			
			//these next two lines were deeply non-intuitive and hard to track down
			$em = $this->getDoctrine()->getManager();
			$result = $em->createQueryBuilder();
			
			//for debugging
			//$startTime = '2018-08-15 16:01';
			//$endTime = '2019-01-01';
			//print_r($result);
			//die();
			//this sure wasn't easy:
			$qb = $result
				->select('s.id, s.employeeId, s.managerId, s.startTime, s.endTime')//
				->from('\App\Entity\Shift', 's')
				->where('(s.startTime >= :startTime AND s.startTime <= :endTime 
				OR  s.endTime >= :startTime AND s.startTime <= :startTime 
				)
				
				AND s.id != :id')
				->setParameter('startTime', $startTime)
				->setParameter('endTime', $endTime)
				->setParameter('id', $id)
				->orderBy('s.startTime', 'ASC')
				->getQuery();
				
			
			$overlaps = $qb->execute();
			//print_r($qb->getSQL());
			//$parameters = $qb->getParameters();
			//print_r($parameters);
			//print_r($overlaps);
			
			//now i need to populate names in those overlaps. i could've done it with a join in the queryBuilder but 
			//it was already kinda brittle
			foreach($overlaps as &$overlap) {
				$employeeId = $overlap['employeeId'];
				if($employeeId) {
					$employee = $this->getDoctrine()->getRepository(User::class)->find($employeeId);
					$overlap['employee'] = $employee;
				}
				$managerId = $overlap['managerId'];
				if($managerId) {
					$manager = $this->getDoctrine()->getRepository(User::class)->find($managerId);
					$overlap['manager'] = $manager;
				}
			}
			$arrayOut = array("shift"=>$entity, "overlaps"=>$overlaps);
		} else { //no shift id; just need info to populate a form
			$arrayOut = array("shift"=>null, "overlaps"=>null);
		}
		if($includeUsers) {
			$arrayOut['managers'] = $this->getDoctrine()->getRepository(User::class)->findBy( array('role' => 'manager'), array('name'=>'ASC'));
			$arrayOut['employees'] = $this->getDoctrine()->getRepository(User::class)->findBy(array('role' => 'employee'), array('name'=>'ASC'));
		}
		return View::create($arrayOut, Response::HTTP_OK);
    }
	
	 /**
     * Replaces Shift resource
	 * @Route("/shift/save/{id}", methods="PUT")
     */
	 //you will need Allow-Control-Allow-Origin: 
	 //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US
	 //to test across domains
    public function putShift(int $id, Request $request): View
    {	
	 
		//there's a better way involving DTOs etc that i don't have time to figure out today!
		$manager_id =  $request->request->get('manager_id');
		$employee_id =  $request->request->get('employee_id');

		$break =  $request->request->get('break');
	 
		$entityManager = $this->getDoctrine()->getManager();
		
		$entity = $this->getDoctrine()->getRepository(Shift::class)->find($id);
		$entity->setManagerId($manager_id);
		$entity->setEmployeeId($employee_id);
		//does this look unnecessarily complicated to you? it does to me too!
		$startTime = \DateTime::createFromFormat('Y-m-d H:i:s', date('Y-m-d H:i:s',strtotime($request->request->get('start_time'))));
		
		$endTime = \DateTime::createFromFormat('Y-m-d H:i:s', date('Y-m-d H:i:s',strtotime($request->request->get('end_time'))));
		
		if($startTime>$endTime) {
			return View::create(array('code'=>201, 'shift'=>null, 'error'=>'End Time must be later than or the same as Start Time.'), Response::HTTP_OK);
		}
		
		$entity->setStartTime($startTime);
		$entity->setEndTime($endTime);
		$entity->setBreak($break);
		
		//dont change created_at on a put unless we're using it for create!
		if(!$id) {
			$entity->setCreatedAt(new \DateTime());
		}
		$entity->setUpdatedAt(new \DateTime());
		
		$entityManager->persist($entity);
		$entityManager->flush();
        // If PUT returns a 200 HTTP OK response with the entity
        return View::create(array('code'=>200, 'shift'=>$entity), Response::HTTP_OK);
    }
	
	
	 /**
	 * Replaces User resource
	 * @Route("/shift/save", methods="POST")
	 */
	 //you will need Allow-Control-Allow-Origin: 
	 //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US
	 //to test across domains
    public function postShift(Request $request): View
    {	
	 
		//there's a better way involving DTOs etc that i don't have time to figure out today!
		$manager_id =  $request->request->get('manager_id');
		$employee_id =  $request->request->get('employee_id');

		$break =  $request->request->get('break');
	 
		$entityManager = $this->getDoctrine()->getManager();
		
		$entity = new Shift;
		$entity->setManagerId($manager_id);
		$entity->setEmployeeId($employee_id);
	//does this look unnecessarily complicated to you? it does to me too!
		$startTime = \DateTime::createFromFormat('Y-m-d H:i:s', date('Y-m-d H:i:s',strtotime($request->request->get('start_time'))));
		$endTime = \DateTime::createFromFormat('Y-m-d H:i:s', date('Y-m-d H:i:s',strtotime($request->request->get('end_time'))));
		if($startTime>$endTime) {
			return View::create(array('code'=>201, 'shift'=>null, 'error'=>'End Time must be later than or the same as Start Time.'), Response::HTTP_OK);
		}
		$entity->setStartTime($startTime);
		$entity->setEndTime($endTime);
		
		
		$entity->setBreak($break);
		
		//dont change created_at on a put unless we're using it for create!
	
		$entity->setCreatedAt(new \DateTime());

		$entity->setUpdatedAt(new \DateTime());
		
		$entityManager->persist($entity);
		$entityManager->flush();
        // If PUT returns a 200 HTTP OK response with the entity
        return View::create(array('code'=>200, 'shift'=>$entity), Response::HTTP_OK);
    }
	
	 
	
	     /**
	 //hmm: symfony hides routes in the /comments/
     * Retrieves range of shifts in range
     * @Rest\Get("/shift/range/{startTime}/{endTime}")
     * @param date $startTime, date $endTime, 
     * @return JSON
     * @throws \Doctrine\ORM\EntityNotFoundException
     */
    public function getShiftsOverRange($startTime, $endTime)
    {
		//these next two lines were deeply non-intuitive and hard to track down
		$em = $this->getDoctrine()->getManager();
		$connection = $em->getConnection();
 		$startTime = date('Y-m-d H:i:s', strtotime($startTime));
		$endTime =  date('Y-m-d H:i:s', strtotime($endTime));
		//echo $startTime;
		//echo $endTime;
		//this is what i would like the sql to look like:
		/*
		SELECT *
		FROM shift WHERE start_time >= :startTime  
		AND start_time <= :endTime  
		ORDER BY start_time ASC
		*/
		//these next two lines were deeply non-intuitive and hard to track down
		$result = $em->createQueryBuilder();
		$qb = $result
			->select('s.id, s.employeeId, s.managerId, s.startTime AS start_time, s.endTime AS end_time')//
			->from('\App\Entity\Shift', 's')
			->where('s.startTime >= :startTime AND s.startTime <= :endTime')
			->setParameter('startTime', $startTime)
			->setParameter('endTime', $endTime)
			->orderBy('s.startTime', 'ASC')
			->getQuery();
				
		$entities = $qb->execute();
		foreach($entities as &$entity) {
			$employeeId = $entity['employeeId'];
			if($employeeId) {
				$employee = $this->getDoctrine()->getRepository(User::class)->find($employeeId);
				$entity['employee'] = $employee;
 

			}
		}
		//print_r($qb->getSQL());
		//$parameters = $qb->getParameters();
		//print_r($parameters);
		
		//how i want to do things:
		//return new JsonResponse($entity);
		//how i must do things:
		return View::create($entities, Response::HTTP_OK);
    }
	
	
	
}